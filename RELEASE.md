Release Process
===============

1. Decide on a release version number, follow http://semver.org/ for the
   naming system.
2. Update package.json with the version number.
3. Commit and push.
4. Git tag with the version number and push the tags:

    git tag -a <version> -m "<description>"
    git push origin --tags

5. Publish the new version to npm:

    cd /dir/of/canvas-5-polyfill
    npm publish .

Note that you don't need to publish to Bower, it will pick up the new version
from the Git tag.

