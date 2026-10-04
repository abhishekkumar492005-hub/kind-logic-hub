<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep PR Vault user records in Cloud tables with per-user policies; browser writes use the generated client so data is scoped to the signed-in account.
- Keep marketing routes public and gate personal tracking in the app UI; this avoids protected calls during public prerender.
