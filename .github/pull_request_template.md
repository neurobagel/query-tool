<!--- Until this PR is ready for review, you can include [WIP] in the title, or create a draft PR. -->


<!---
Below is a suggested pull request template. Feel free to add more details you feel are relevant/necessary.

For more info on the Neurobagel PR process and other contributing guidelines, see https://neurobagel.org/contributing/CONTRIBUTING/.
-->

<!-- 
Please indicate after the # which issue you're closing with this PR, if applicable.
If the PR closes multiple issues, include "closes" before each one is listed.
You can also link to other issues if necessary, e.g. "See also #1234".

https://help.github.com/articles/closing-issues-using-keywords
-->
- Closes #

<!-- 
Please give a brief overview of what has changed or been added in the PR.
This can include anything specific the maintainers should be looking for when they review the PR.
-->
Changes proposed in this pull request:

-
-

**NOTE: If this pull request is to be released, the release label must be applied once the review process is done to avoid the local and remote from going out of sync as a consequence of the `bump version` workflow run**

<!-- To be checked off by reviewers -->
## Checklist
_This section is for the PR reviewer_

- [ ] PR has an interpretable title with a prefix (`[ENH]`, `[FIX]`, `[REF]`, `[TST]`, `[CI]`, `[MNT]`, `[INF]`, `[MODEL]`, `[DOC]`) _(see our [Contributing Guidelines](https://neurobagel.org/contributing/CONTRIBUTING#pull-request-guidelines) for more info)_
- [ ] PR has a label for the release changelog or `skip-release` (to be applied by maintainers only)
- [ ] PR links to GitHub issue with mention `Closes #XXXX`
- [ ] Tests pass
- [ ] Checks pass
- [ ] If the PR changes the participant-level and/or the dataset-level result file, the [`query-tool-results` files](https://github.com/neurobagel/neurobagel_examples/tree/main/query-tool-results) in the  [neurobagel_examples repo](https://github.com/neurobagel/neurobagel_examples/) have been regenerated

For new features:
- [ ] Tests have been added

For bug fixes:
- [ ] There is at least one test that would fail under the original bug conditions.
