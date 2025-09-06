# Cloudflare Redirect Rule

To enforce a single canonical host (choose either apex -> www or www -> apex). Recommended: redirect `www` to apex.

## Redirect www -> apex

1. Cloudflare Dashboard > Rules > Redirect Rules > Create
1. Rule name: `WWW to Apex`
1. Expression:

```txt
(http.host eq "www.mechanicsofmotherhood.com")
```

1. Then action: Static Redirect
   - Status code: 301
   - Destination URL: `https://mechanicsofmotherhood.com${uri}`

## Redirect apex -> www (alternative)

Expression:

```txt
(http.host eq "mechanicsofmotherhood.com")
```

Destination URL:

```txt
https://www.mechanicsofmotherhood.com${uri}
```

Pick one direction only.

## Cache & HTTPS

- Ensure Always Use HTTPS (SSL/TLS > Edge Certificates) is enabled.
- After adding the rule, Purge Everything (Caching) if previous URLs were cached.

## Verification

```bash
curl -I https://www.mechanicsofmotherhood.com | find "location"
curl -I https://mechanicsofmotherhood.com | find "location"
```

Expect only the source host to redirect; the canonical host should return 200 without redirecting to itself.
