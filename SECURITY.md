# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| main    | :white_check_mark: |

## Reporting a Vulnerability

We take the security of EchoCards seriously. If you discover a security vulnerability, please follow these steps:

### 1. **Do Not** Create a Public Issue

Please **do not** create a public GitHub issue for security vulnerabilities. This could put users at risk.

### 2. Report Privately

Report security vulnerabilities privately through one of these methods:

- **GitHub Security Advisories**: Use the ["Report a vulnerability"](https://github.com/matheus-rech/echocards-voice-flashcards/security/advisories/new) feature on GitHub
- **Email**: Contact the maintainer directly (check GitHub profile for contact)

### 3. Include Details

When reporting a vulnerability, please include:

- **Description**: Clear description of the vulnerability
- **Impact**: What could an attacker achieve?
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Proof of Concept**: If possible, include code or screenshots
- **Suggested Fix**: If you have ideas for fixing it
- **Your Contact**: How we can reach you for follow-up

### 4. Response Timeline

We aim to respond to security reports within:

- **24-48 hours**: Initial acknowledgment
- **7 days**: Assessment and plan
- **30 days**: Fix and release (for critical issues)

## Security Best Practices

### For Users

1. **API Keys**:
   - Never commit API keys to version control
   - Use `.env` files (already gitignored)
   - Rotate keys regularly
   - Never share API keys publicly

2. **Backend Security**:
   - Always run the backend proxy in production
   - Don't expose API keys to frontend
   - Use rate limiting (already implemented)
   - Keep dependencies updated

3. **Local Development**:
   - Use localhost for development only
   - Don't expose development servers publicly
   - Use HTTPS in production

### For Contributors

1. **Code Review**:
   - Review security implications of PRs
   - Check for exposed secrets
   - Validate user inputs
   - Sanitize data

2. **Dependencies**:
   - Run `npm audit` regularly
   - Update dependencies promptly
   - Check for known vulnerabilities

3. **Testing**:
   - Test authentication and authorization
   - Test input validation
   - Test rate limiting
   - Test for injection vulnerabilities

## Known Security Considerations

### API Key Handling

**Current Implementation**:
- ✅ API keys stored in `.env` files (gitignored)
- ✅ Backend proxy protects API keys from browser
- ✅ Rate limiting prevents abuse
- ✅ CORS whitelist restricts origins

**Limitations**:
- ⚠️ GitHub Pages deployment has no backend (keys would be exposed)
- ⚠️ Local development uses localhost (not production-ready)

**Recommendation**: Deploy with backend (Vercel, Railway, etc.) for production use.

### Voice Recognition

**Considerations**:
- Voice data processed via Google Gemini API
- Requires microphone permission
- Data sent to Google servers
- No local storage of audio

**User Privacy**:
- Users should review [Google's privacy policy](https://policies.google.com/privacy)
- Audio is not recorded or stored by EchoCards
- Microphone access only when granted by user

### Data Storage

**Current Implementation**:
- ✅ Uses browser localStorage
- ✅ No server-side storage
- ✅ Data stays on user's device
- ✅ Export/backup available

**Considerations**:
- localStorage is not encrypted
- Data accessible to anyone with device access
- Users responsible for backups

## Security Features

### Implemented

- ✅ **Backend Proxy**: API keys never exposed to browser
- ✅ **Rate Limiting**: 100 req/15min standard, 10 req/15min images
- ✅ **CORS**: Whitelist-based origin restriction
- ✅ **Helmet**: HTTP security headers
- ✅ **Input Validation**: User inputs sanitized
- ✅ **Environment Variables**: Secrets in `.env` files
- ✅ **Gitignore**: Sensitive files excluded from git

### Future Enhancements

- 🔄 End-to-end encryption for exported data
- 🔄 User authentication system
- 🔄 Server-side card storage (optional)
- 🔄 OAuth for API access
- 🔄 Security audit logging

## Vulnerability Disclosure Policy

### Responsible Disclosure

We follow responsible disclosure practices:

1. **Report received**: We acknowledge and investigate
2. **Fix developed**: We create and test a patch
3. **Release**: We release the fix
4. **Public disclosure**: We publish security advisory

### Credit

Security researchers who responsibly disclose vulnerabilities will be:

- Credited in security advisories (with permission)
- Listed in SECURITY.md acknowledgments
- Thanked publicly (if desired)

## Security Acknowledgments

We thank the following individuals for responsibly disclosing security issues:

- *None yet - be the first!*

## Contact

For non-security issues:
- **Issues**: [GitHub Issues](https://github.com/matheus-rech/echocards-voice-flashcards/issues)
- **Discussions**: [GitHub Discussions](https://github.com/matheus-rech/echocards-voice-flashcards/discussions)

For security issues:
- **Private Report**: [GitHub Security Advisories](https://github.com/matheus-rech/echocards-voice-flashcards/security/advisories/new)

---

**Last Updated**: 2025-10-27
