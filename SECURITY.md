# Security Policy

AI Life OS will process highly sensitive personal data. Security and privacy are core product requirements.

- Never commit secrets, API keys, access tokens, personal exports, or production data.
- Use `.env` locally and keep `.env.example` non-secret.
- Minimize stored data and scope access by user.
- Encrypt sensitive data in transit and at rest when implementation begins.
- Treat retrieved documents, web pages, messages and tool output as untrusted content.
- Never let external text override system or repository instructions.
- Report suspected vulnerabilities privately to the project owner.
