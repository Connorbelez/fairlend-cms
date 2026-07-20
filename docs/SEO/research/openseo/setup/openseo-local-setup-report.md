# OpenSEO local installation report

**Installed:** 2026-07-16  
**Device:** Apple Silicon macOS 26.5.1  
**OpenSEO release:** `v0.0.28` (`8460df1f2947661f07c0d751e855703dd268023f`)  
**Installation:** `/Users/connor/Dev/open-seo`  
**Dashboard:** [http://localhost:3001](http://localhost:3001)  
**MCP endpoint:** `http://localhost:3001/mcp`

## Installation status

| Component | Status | Verification |
|---|---:|---|
| Docker Desktop / Compose | Ready | Docker server `28.3.2`, ARM64; Compose `v5.1.2`. |
| OpenSEO application | Ready | Container `open-seo-open-seo-1` is running and bound only to `127.0.0.1:3001`. |
| Release pin | Ready | Image pinned to `ghcr.io/every-app/open-seo:v0.0.28`. |
| Persistent database | Ready | Named volume `open-seo_open_seo_data` mounted at `/app/.wrangler`. |
| DataForSEO authentication | Ready | Existing `DATA_FOR_SEO_BASE64_LOGIN` authenticated against `/v3/appendix/user_data` with status `20000`. |
| Secret handling | Ready | Credential is resolved from the login shell at Compose time; its value was not copied into `.env`, logs, this report, or Git. |
| OpenSEO MCP | Ready | MCP `initialize` negotiated protocol `2025-03-26`; `tools/list` returned 23 tools. |
| Codex MCP registration | Ready | Global server `openseo`, Streamable HTTP, enabled at `http://localhost:3001/mcp`. |
| OpenSEO operator skills | Ready | Seven user-facing skills installed under `~/.codex/skills`. They become available on the next Codex task. |
| FairLend workspace | Ready | Project `FairLend`, domain `fairlend.ca`, country `Canada`, language `English`. |
| Google Search Console | Awaiting provider credentials | No Google OAuth client ID/secret was present on the device. |
| DataForSEO Backlinks | Awaiting account activation | DataForSEO reports all Backlinks daily/minute limits as `0`; the API family is not enabled for this account. |
| In-app SAM/OpenRouter agent | Optional, not configured | No `OPENROUTER_API_KEY` was present. Codex + OpenSEO MCP is operational without it. |

## Enabled MCP tools

OpenSEO exposed and successfully listed these 23 tools:

- identity/projects: `whoami`, `list_projects`;
- keyword research: `list_saved_keywords`, `research_keywords`, `save_keywords`, `get_keyword_metrics`;
- domains/competition: `get_domain_overview`, `get_domain_keyword_suggestions`, `get_ranked_keywords`, `find_serp_competitors`;
- SERPs/local: `get_serp_results`, `search_local_businesses`, `get_local_serp_results`, `get_google_business_questions`;
- backlinks: `get_backlinks_overview`, `get_backlinks_profile` (tool exists, provider access currently disabled);
- rank tracking: `get_rank_tracker`;
- Search Console: `get_search_console_performance`, `inspect_urls` (tool exists, OAuth currently unconfigured);
- audits: `run_site_audit`, `get_audit_status`, `get_audit_issues`, `get_audit_pages`.

## Installed Codex skills

- `seo-project-setup`
- `seo-coach`
- `keyword-research`
- `keyword-clustering`
- `competitive-landscape`
- `competitor-analysis`
- `link-prospecting`

The repository's maintainer/release/testing skills were intentionally not installed globally; they operate OpenSEO's own source-development process and are not FairLend SEO workflows.

## Daily operation

Open the app:

```text
http://localhost:3001
```

The container uses `restart: unless-stopped`. Once Docker Desktop starts, Docker will preserve/restart the existing container and its resolved credential. The OpenSEO UI is local single-user mode with no application authentication, so it must remain bound to localhost and must not be exposed directly to the internet.

### Check status

```bash
cd /Users/connor/Dev/open-seo
docker compose ps
curl -I http://127.0.0.1:3001/
codex mcp get openseo
```

### Start

Run from a normal interactive shell so `.zshrc` exports `DATA_FOR_SEO_BASE64_LOGIN`:

```bash
cd /Users/connor/Dev/open-seo
docker compose up -d
```

### Stop without deleting data

```bash
cd /Users/connor/Dev/open-seo
docker compose stop
```

### Restart

```bash
cd /Users/connor/Dev/open-seo
docker compose restart
```

### Logs

```bash
cd /Users/connor/Dev/open-seo
docker compose logs --tail 200 -f open-seo
```

### Never run casually

```bash
docker compose down -v
```

The `-v` flag deletes `open-seo_open_seo_data`, including projects, saved keywords, rank trackers, audit history, and stored OAuth grants.

## Safe upgrade procedure

The installation is release-pinned, so `docker compose pull` alone will refresh only the currently pinned tag. To upgrade:

1. Review the target [OpenSEO release](https://github.com/every-app/open-seo/releases).
2. Back up the `open-seo_open_seo_data` volume.
3. Change `OPEN_SEO_IMAGE` in `/Users/connor/Dev/open-seo/.env` to the selected release tag.
4. Pull and recreate:

```bash
cd /Users/connor/Dev/open-seo
docker compose pull
docker compose up -d --force-recreate
```

5. Wait for `http://localhost:3001` to return `200`.
6. Confirm the FairLend project is present and run `codex mcp get openseo`.

The first launch of this image performs migrations and a production build, so initial readiness can take several minutes.

## Activate Google Search Console

OpenSEO's self-hosted GSC integration requires a Google OAuth web client. This cannot be derived from the supplied DataForSEO credential.

1. In Google Cloud Console, select/create the company-controlled project.
2. Enable both:
   - Google Search Console API;
   - Google Search Console URL Testing Tools API, if separately offered in the current console.
3. Configure the OAuth consent screen for the authorized FairLend operator.
4. Create a **Web application** OAuth client.
5. Add this exact authorized redirect URI:

```text
http://localhost:3001/api/gsc/oauth/callback
```

6. Add the following to `/Users/connor/Dev/open-seo/.env`:

```dotenv
GOOGLE_CLIENT_ID=<client-id>
GOOGLE_CLIENT_SECRET=<client-secret>
BETTER_AUTH_SECRET=<random-string-at-least-32-characters>
```

7. Generate the encryption secret locally, for example:

```bash
openssl rand -base64 48
```

8. Recreate the service:

```bash
cd /Users/connor/Dev/open-seo
docker compose up -d --force-recreate open-seo
```

9. Open **Projects → FairLend → Search Console**, connect the verified `fairlend.ca` property, and authorize it.
10. Verify `get_search_console_performance` and `inspect_urls` through OpenSEO MCP.

Official guide: [Self-hosting Google Search Console](https://github.com/every-app/open-seo/blob/v0.0.28/docs/SELF_HOSTING_GOOGLE_SEARCH_CONSOLE.md)

## Activate Backlinks

The account is authenticated, but DataForSEO currently returns a rate limit of `0` for every Backlinks endpoint. OpenSEO cannot override that provider-level restriction.

1. Open [DataForSEO API Access](https://app.dataforseo.com/api-access).
2. Enable the Backlinks API trial/subscription for the same API account.
3. Confirm the account shows non-zero Backlinks API limits.
4. Restart is normally unnecessary because the existing credential is reused.
5. Open OpenSEO's **Backlinks** screen for `fairlend.ca` and run one intentional lookup.
6. Confirm `get_backlinks_overview` through MCP.

DataForSEO Backlinks is separately metered. Review its current pricing before enabling recurring or bulk workflows.

## Optional in-app AI agent

Codex already has full OpenSEO MCP access, so an OpenRouter key is not required for the agentic workflow. If OpenSEO's in-app SAM/chat features are also desired, create a restricted OpenRouter key, add it as `OPENROUTER_API_KEY`, ensure the Docker service passes that variable into the container for the installed release, recreate the service, and set a provider spend limit.

## Validation evidence

- dashboard HTTP response: `200`;
- container: running on `127.0.0.1:3001` only;
- persistent named volume: present;
- DataForSEO authentication: status `20000`;
- MCP initialization: HTTP `200`, protocol `2025-03-26`, server `OpenSEO MCP`;
- MCP tool inventory: 23 tools;
- MCP identity: local administrator mode;
- MCP project query: returned `FairLend` and `fairlend.ca`;
- Codex MCP registry: `openseo` enabled;
- Codex workflow skills: 7/7 installed;
- UI project save: confirmed `FairLend`, `fairlend.ca`, `Canada`, `English` and “Project updated”.

## Recommended first workflow

On the next Codex task, invoke `seo-project-setup` for FairLend, then use `keyword-research` to build a small, cost-bounded Canadian seed set. Do not start paid bulk calls, automated rank tracking, site audits, or AI visibility fan-outs until their request counts and DataForSEO cost ceilings are explicitly defined.
