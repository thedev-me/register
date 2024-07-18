# <p align="center"> *.thedev.me - Free Subdomains </p>
**<p align="center"> Get your free `{name}.thedev.me` subdomain </p>**

![header](media/header_round.png)
<p align="center">
    <img src="https://img.shields.io/github/stars/thedev-me/register?label=stars&style=for-the-badge&color=FFD700" alt="GitHub stars">&nbsp;&nbsp;
    <img src="https://img.shields.io/github/directory-file-count/thedev-me/register/domains?label=domains&style=for-the-badge&color=4CAF50" alt="Domains">&nbsp;&nbsp;
    <img src="https://img.shields.io/github/issues-pr/thedev-me/register?label=Pull%20Requests&style=for-the-badge&color=FFA500" alt="GitHub pull requests">&nbsp;&nbsp;
</p>


## How to Get Your Subdomain

1. 🌟 Star and fork this repository
2. 📰 Read the entire README and review our [Terms of Service](TERMS.md)
3. 🗄️ In the `./domains` directory, create a new JSON file named `yoursubdomain.thedev.me.json`
4. ✍️ Fill in the JSON file (format below). Make sure the JSON is valid with no trailing commas.
5. 🫷 Submit a pull request with your changes
6. 🤖 Automated checks will run and report any JSON errors (First time contributors wait for a manual trigger)
7. ✅ After manual review and approval, your subdomain will be added

> [!NOTE]
> Passing automated checks does NOT guarantee approval. All submissions undergo manual review to ensure quality and compliance.


## Supported Record Types

- We support **A, AAAA, CNAME, MX, and TXT** record types.

- **We do NOT support wildcards or sub-subdomains.** <sub>(yet).</sub>


## JSON Formatting

To register your subdomain, create a new JSON file in the `./domains` directory. The filename should be in the following format, `yoursubdomain.thedev.me.json`.

Use the following structure for your JSON file.

> [!IMPORTANT]  
> Only keep the records you need, change their values, and delete the rest. For most people, that will be A or CNAME records. MX and TXT records manage email routing and verify email authenticity and domain ownership. [Learn more about DNS records.](https://www.cloudflare.com/learning/dns/dns-records/)

> [!IMPORTANT]
> Ensure your JSON file is valid with NO trailing commas. You can easily check the format validity [here](https://jsonlint.com).

```json
{
  "subdomain": "yoursubdomain",
  "domain": "thedev.me",
  "public_email": "user@example.com",
  "github_username": "user",
  "description": "A brief description of the purpose of the subdomain",

  "records": {
    "A": [
      "192.0.2.1",
      "192.0.2.2"
    ],
    "AAAA": [
      "2001:db8::1",
      "2001:db8::2"
    ],
    "CNAME": [
      "example.com"
    ],
    "MX": [
      "mail1.example.com",
      "mail2.example.com"
    ],
    "TXT": [
      "v=spf1 include:_spf.example.com ~all"
    ]
  },
  "proxied": true
}
```


## Fields Explanation

- `subdomain`: Your desired subdomain (e.g., "myproject" for myproject.thedev.me)
- `domain`: Always "thedev.me"
- `public_email`: Your public contact email
- `github_username`: Your GitHub username
- `description`: A brief description of your subdomain's purpose
- `records`: DNS records for your subdomain. Only keep the ones you need. [Learn more.](https://www.cloudflare.com/learning/dns/dns-records/)
- `proxied`: Set to `true` if you want to use Cloudflare's proxy, `false` otherwise.


## Terms and Conditions

By using this service, you agree to be bound by our [Terms of Service](TERMS.md). Please review them carefully.


## License

MIT License


## Support

If you need help or have questions, please open an issue in this repository or send an email to contact@thedev.me


## Featured

If you're interested in registering subdomains similar to `*.thedev.me`, consider exploring these services:
- [Open Domains](https://open-domains.net)
- [is-a.dev](https://www.is-a.dev)
- [thedev.id](https://thedev.id)
- [js.org](https://github.com/js-org/js.org)
