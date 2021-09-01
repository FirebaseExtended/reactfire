# Contributing | ReactFire

Thank you for contributing to the Firebase community!

- [Have a usage question?](#question)
- [Think you found a bug?](#issue)
- [Have a feature request?](#feature)
- [Want to submit a pull request?](#submit)
- [Need to get set up locally?](#local-setup)

## <a name="question"></a>Have a usage question?

We get lots of those and we love helping you, but GitHub is not the best place for them. Issues
which just ask about usage will be closed. Here are some resources to get help:

- Start with the [quickstart](../docs/quickstart.md)
- Go through the [guide](../docs/use.md)
- Read the full [API reference](../docs/reference)

If the official documentation doesn't help, try starting a [discussion](https://github.com/FirebaseExtended/reactfire/discussions).

**Please avoid double posting across multiple channels!**

## <a name="issue"></a>Think you found a bug?

Yeah, we're definitely not perfect!

Search through [old issues](https://github.com/firebase/reactfire/issues) before submitting a new
issue as your question may have already been answered.

If your issue appears to be a bug, and hasn't been reported,
[open a new issue](https://github.com/firebase/reactfire/issues/new). Please use the provided bug
report template and include a minimal repro.

If you are up to the challenge, [submit a pull request](#submit) with a fix!

## <a name="feature"></a>Have a feature request?

Great, we love hearing how we can improve our products! After making sure someone hasn't already
requested the feature in the [existing issues](https://github.com/firebase/reactfire/issues), go
ahead and [open a new issue](https://github.com/firebase/reactfire/issues/new). Feel free to remove
the bug report template and instead provide an explanation of your feature request. Provide code
samples if applicable. Try to think about what it will allow you to do that you can't do today? How
will it make current workarounds straightforward? What potential bugs and edge cases does it help to
avoid?

## <a name="submit"></a>Want to submit a pull request?

Sweet, we'd love to accept your contribution! [Open a new pull request](https://github.com/firebase/reactfire/pull/new/master)
and fill out the provided form.

**If you want to implement a new feature, please open an issue with a proposal first so that we can
figure out if the feature makes sense and how it will work.**

Make sure your changes pass our linter and the tests all pass on your local machine. We've hooked
up this repo with continuous integration to double check those things for you.

Most non-trivial changes should include some extra test coverage. If you aren't sure how to add
tests, feel free to submit regardless and ask us for some advice.

Finally, you will need to sign our [Contributor License Agreement](https://cla.developers.google.com/about/google-individual)
before we can accept your pull request.

## <a name="local-setup"></a>Need to get set up locally?

If you'd like to contribute to ReactFire, you'll need to do the following to get your environment
set up.

### For development

1. [Clone](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository)
   this repository (or a
   [fork](https://help.github.com/en/github/getting-started-with-github/fork-a-repo#propose-changes-to-someone-elses-project))
1. At the project root, install all modules by running `yarn install`.
1. Start a dev build of reactfire by running `yarn start`. ReactFire will recompile on every file change.

### Testing

1. run `yarn test` from the repository root. Make sure you've rebuilt your changes (usually by keeping `yarn start` running in a separate tab).

### Before submitting a PR

1. run `yarn build` to confirm that the source builds
2. run `yarn test` to confirm that tests pass
3. run `yarn lint` to confirm that code meets our style guide
    > If the lint check fails, run `yarn lint --fix` to automatically fix any issues. 
5. run `yarn docs` to rebuild the reference docs
    > If you've forked the repo, run `yarn docs:fork` instead. This will ensure the reference docs link to the firebaseextended/reactfire repository.
