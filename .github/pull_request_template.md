## What and why

<!-- What does this change, and which phase / PRD section does it serve? -->

## How to check it

<!-- Steps a reviewer can follow in the demo. -->

## Checklist

- [ ] Mock data only: no real backend, auth, API, email, analytics or third-party calls
- [ ] Data access goes through `repositories`, not the store or fixtures directly
- [ ] New fixtures are synthetic, use `example.com` emails, and pass the integrity test
- [ ] Loading, empty, error and success states are handled
- [ ] Keyboard and screen-reader friendly; status is not shown by colour alone
- [ ] Works at mobile and desktop widths
- [ ] `npm run lint`, `npm run typecheck`, `npm test` and `npm run e2e` pass
