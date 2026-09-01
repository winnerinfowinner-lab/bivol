---
title: "Realtime Mailbox Existence Check: Deep Protocol Inspection without Email Sending"
metaDescription: "Master the mechanics of a realtime mailbox existence check using raw TCP sockets, SMTP RCPT TO handshakes, and MX response code parsing."
slug: "realtime-mailbox-existence-check"
category: "email-verification"
tags:
  - "mailbox-check"
  - "realtime-verification"
  - "smtp-protocol"
  - "deliverability"
targetKeyword: "realtime mailbox existence check"
author: "Bivol Engineering Team"
publishDate: "2026-08-05"
ogImage: "https://bivol.xyz/images/og/realtime-mailbox-existence-check.jpg"
coverImage: "https://bivol.xyz/images/cover/realtime-mailbox-existence-check.jpg"
imageAlt: "Realtime mailbox existence check network interaction"
dynamicFAQs:
  - question: "How does a realtime mailbox existence check determine if a mailbox exists?"
    answer: "By opening a direct TCP socket connection to the domain's MX server and testing the RCPT TO command response without sending an email payload."
  - question: "What is the difference between a domain check and a mailbox existence check?"
    answer: "A domain check only verifies if the domain name and MX records exist. A mailbox existence check confirms that the specific username (e.g. alex.smith) actually exists on that mail server."
  - question: "Can a realtime mailbox existence check be blocked by graylisting?"
    answer: "Yes. Some mail servers use graylisting (returning 451 temporary errors). Advanced verification systems handle graylisting with retry queues and warm connection pools."
schemaType: "TechArticle"
redirects:
  - "/blog/realtime-mailbox-check"
---

# Realtime Mailbox Existence Check: Deep Protocol Inspection without Email Sending

Validating whether a specific email inbox actively exists on a remote mail server is the holy grail of deliverability management. While checking syntax and DNS records confirms domain health, only a **realtime mailbox existence check** provides definitive confirmation that an individual account (`john.doe@company.com`) is live, active, and capable of receiving messages.

## 1. Deep Protocol Flow of a Mailbox Existence Check

A realtime mailbox existence check mimics the initial negotiation phase of a standard Mail Transfer Agent (MTA) without transmitting an actual message payload.

```
[Client App] --> (TCP Port 25) --> [Destination MX Server]
   |                                     |
   |--- EHLO verifier.bivol.xyz -------->|
   |<-- 250 Hello / Capabilities --------|
   |--- MAIL FROM:<check@bivol.xyz> ---->|
   |<-- 250 2.1.0 Sender OK -------------|
   |--- RCPT TO:<john.doe@company.com> ->|
   |<-- 250 2.1.5 Recipient OK !! -------| (Mailbox Exists)
   |--- QUIT --------------------------->|
   |<-- 221 2.0.0 Service closing -------|
```

### Protocol Execution Sequence:
1. **MX Discovery:** Resolves target domain MX records via recursive DNS queries.
2. **Socket Handshake:** Opens a TCP socket on port 25 (or 587) to the primary MX host.
3. **EHLO Identification:** Issues `EHLO` with a fully qualified domain name (FQDN) possessing valid reverse DNS (rDNS).
4. **Envelope Sender Declaration:** Issues `MAIL FROM:<valid-sender@domain.com>`.
5. **Recipient Probe (`RCPT TO`):** Sends `RCPT TO:<target.email@domain.com>`.
   - **`250 2.1.5 Recipient OK`**: Mailbox exists and accepts mail.
   - **`550 5.1.1 User Unknown`**: Mailbox does not exist (Hard Bounce).
   - **`451 / 421 Temporary Rejection`**: Greylisting active — requires automated retry.
6. **Graceful Termination (`QUIT`):** Sends `QUIT` immediately before any `DATA` command is transmitted, ensuring zero inbox clutter.

## 2. Technical Code Implementation in TypeScript

Here is a resilient implementation of a realtime mailbox existence check with socket timeout management:

```typescript
import net from 'net';
import dns from 'dns/promises';

export interface MailboxCheckResult {
  email: string;
  exists: boolean;
  mxHost: string;
  smtpCode: number;
  responseMessage: string;
}

export async function checkMailboxExistence(email: string): Promise<MailboxCheckResult> {
  const [localPart, domain] = email.split('@');

  // 1. Resolve MX host
  const mxRecords = await dns.resolveMx(domain);
  if (!mxRecords || mxRecords.length === 0) {
    throw new Error(`No MX records found for domain: ${domain}`);
  }

  const primaryMx = mxRecords.sort((a, b) => a.priority - b.priority)[0].exchange;

  // 2. Execute socket-level RCPT TO probe
  return new Promise((resolve) => {
    const socket = net.createConnection(25, primaryMx);
    let step = 0;
    let smtpCode = 0;
    let responseMsg = '';

    socket.setTimeout(6000, () => {
      socket.destroy();
      resolve({
        email,
        exists: false,
        mxHost: primaryMx,
        smtpCode: 408,
        responseMessage: 'Socket Connection Timeout',
      });
    });

    socket.on('data', (data) => {
      responseMsg = data.toString().trim();
      smtpCode = parseInt(responseMsg.substring(0, 3), 10);

      if (step === 0 && smtpCode === 220) {
        socket.write('EHLO verify.bivol.xyz\r\n');
        step++;
      } else if (step === 1 && smtpCode === 250) {
        socket.write('MAIL FROM:<verifier@bivol.xyz>\r\n');
        step++;
      } else if (step === 2 && smtpCode === 250) {
        socket.write(`RCPT TO:<${email}>\r\n`);
        step++;
      } else if (step === 3) {
        const exists = smtpCode === 250;
        socket.write('QUIT\r\n');
        socket.end();
        resolve({
          email,
          exists,
          mxHost: primaryMx,
          smtpCode,
          responseMessage: responseMsg,
        });
      }
    });

    socket.on('error', (err) => {
      resolve({
        email,
        exists: false,
        mxHost: primaryMx,
        smtpCode: 500,
        responseMessage: err.message,
      });
    });
  });
}
```

## 3. Handling Protocol Edge Cases & Security Defenses

### Catch-All Server Handling
Certain mail servers (e.g. corporate Catch-All configurations) return `250 OK` for every username tested. Realtime verifiers detect catch-alls by probing a random control string (e.g., `random_test_x982@domain.com`). If the control string also returns `250 OK`, the domain is categorized as `catch_all`.

### Greylisting Mitigation
Security gateways temporarily defer initial connections from unknown IPs with a `451 4.7.1 Try again later` code. High-performance verification networks maintain persistent warm connection pools and automatic retry queues to resolve greylisted addresses in under 2 seconds.

## 4. Key Implementation Benefits

1. **Definitive Mailbox Accuracy:** Confirms account existence down to the specific user account.
2. **Zero Message Delivery:** Silently inspects mailboxes without alerting account owners or sending unwanted emails.
3. **Protection Against Hard Bounces:** Ensures zero hard bounces before sending critical sales or onboarding campaigns.
