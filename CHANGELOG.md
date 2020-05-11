## [2.4.2](https://github.com/dhis2/app-hub/compare/v2.4.1...v2.4.2) (2020-05-11)


### Bug Fixes

* upload and deletion of logo ([#332](https://github.com/dhis2/app-hub/issues/332)) ([1ec35ba](https://github.com/dhis2/app-hub/commit/1ec35baa8418b94686fe07c92c42a1abb1de1f2b))

## [2.4.1](https://github.com/dhis2/app-hub/compare/v2.4.0...v2.4.1) (2020-05-04)


### Bug Fixes

* show org name instead of individual dev ([ddfe97d](https://github.com/dhis2/app-hub/commit/ddfe97da373cd801873d49bd2102cd5bf60d22fa))

# [2.4.0](https://github.com/dhis2/app-hub/compare/v2.3.5...v2.4.0) (2020-05-04)


### Bug Fixes

* add owner to clone script to keep user access ([78eb336](https://github.com/dhis2/app-hub/commit/78eb336ac6f790d5ad28b4c6543ea450ffc08158))
* add support for owner when creating app ([4c88334](https://github.com/dhis2/app-hub/commit/4c88334323b2467eaa64d4902ef86c64c0fa9710))
* add user to org if not in org ([106161b](https://github.com/dhis2/app-hub/commit/106161be24872e42f288e38cc3871bdf8c145d1d))
* avoid creating dupes when cloning ([c4ce579](https://github.com/dhis2/app-hub/commit/c4ce57975f274ede6f40f08739c494be0be3db5b))
* check against correct app_id ([ebd9dd9](https://github.com/dhis2/app-hub/commit/ebd9dd9a8e2dff41976c84896c2415c62309c515))
* only add to org if manager or same as currUser ([ea6ce0c](https://github.com/dhis2/app-hub/commit/ea6ce0c78e7b03bb337190e8db751287708e21ad))
* remove < 2.28 versions and add 2.33, 2.34 ([16ffcf8](https://github.com/dhis2/app-hub/commit/16ffcf81aa352a53f9e858b6a1be2d5856483de0))
* return 400 if trying to upload to other org ([db084e6](https://github.com/dhis2/app-hub/commit/db084e61e98ea6f6b90373db26a62945bafbcc24))
* show errormessage from unauthorized response ([d768285](https://github.com/dhis2/app-hub/commit/d768285e71f15cc9c272faadb03a4ebe54e89d65))
* update test to work with new versions ([ab8e141](https://github.com/dhis2/app-hub/commit/ab8e1417197c227aa53266c05f0e13d9e69ce66d))
* use email from jsonpayload ([944f6c4](https://github.com/dhis2/app-hub/commit/944f6c441b6484d2bdd743badb03e1ffe040e613))
* use transaction when getting user ([1536a44](https://github.com/dhis2/app-hub/commit/1536a446af73a8d04adbe787febe139a218f06bc))


### Features

* **organisationService:** add hasUser-function ([9b7a0eb](https://github.com/dhis2/app-hub/commit/9b7a0eb103bd2855043b4bf6b9d52edb0b853d5f))

## [2.3.5](https://github.com/dhis2/app-hub/compare/v2.3.4...v2.3.5) (2020-04-27)


### Bug Fixes

* avoid creating dupes when cloning ([2cd8fc0](https://github.com/dhis2/app-hub/commit/2cd8fc0729a91a8251597b9956104f5887e8c392))
* correct mkdirSync params ([74aaa04](https://github.com/dhis2/app-hub/commit/74aaa04d67dbdc9632f7a409e7ed0d6025d2b50d))

## [2.3.4](https://github.com/dhis2/app-hub/compare/v2.3.3...v2.3.4) (2020-04-24)


### Bug Fixes

* appcard height ([caf7a2f](https://github.com/dhis2/app-hub/commit/caf7a2f15b0864886c2aed06a4cb86a23da97c49))

## [2.3.3](https://github.com/dhis2/app-hub/compare/v2.3.2...v2.3.3) (2020-04-23)


### Bug Fixes

* move users-with-organisations view to correct folder ([22d31d4](https://github.com/dhis2/app-hub/commit/22d31d479fb712675c5039704433d699036d6be2))

## [2.3.2](https://github.com/dhis2/app-hub/compare/v2.3.1...v2.3.2) (2020-04-22)


### Bug Fixes

* **createapp:** add user to organisation if org does note xist ([ffb0733](https://github.com/dhis2/app-hub/commit/ffb07331ed68384924142d2d8cb062afe0811290))

## [2.3.1](https://github.com/dhis2/app-hub/compare/v2.3.0...v2.3.1) (2020-04-22)


### Bug Fixes

* handle downloads without auth ([b58d8bb](https://github.com/dhis2/app-hub/commit/b58d8bb2a772cb0642c42180d030836c90cd4652))

# [2.3.0](https://github.com/dhis2/app-hub/compare/v2.2.0...v2.3.0) (2020-04-21)


### Bug Fixes

* add @hapi/bounce, lowercase imports ([dc90ef4](https://github.com/dhis2/app-hub/commit/dc90ef43335c94c5236a8811a28a57bdc594b77a))
* add support for tags ([5b77fbb](https://github.com/dhis2/app-hub/commit/5b77fbba5ff35ea7603f21f7f7f6ba926e10ad19))
* add tests ([064a84d](https://github.com/dhis2/app-hub/commit/064a84d0ccc4daa111049e7df7efc43ed4138d57))
* boomify filter errors, rethrow system-errors ([724b52c](https://github.com/dhis2/app-hub/commit/724b52ca06b42804989817faec55e7dcc2ed47c6))
* cleanup, map SQL operator ([804d7b3](https://github.com/dhis2/app-hub/commit/804d7b3d7e7b7e12771aa3189d45a6fccf11f578))
* filter creation ([33cf418](https://github.com/dhis2/app-hub/commit/33cf4188bd4c225caa0ed924f0e408e4b9b22632))
* improve swagger docs ([ee55200](https://github.com/dhis2/app-hub/commit/ee55200004f38b1dde1f0d944a6a19091ab3703d))
* **filter:** filter creation with renames ([1327ee8](https://github.com/dhis2/app-hub/commit/1327ee89e29693fe053213ab86a44cd368bbaff8))
* rename support, cleanup ([6fa6a83](https://github.com/dhis2/app-hub/commit/6fa6a834bb52208862262a890c2d418f4452eb8d))
* support renames in createFromQueryFiltes ([36c662d](https://github.com/dhis2/app-hub/commit/36c662dddadfc04dcf90dc8799590361609d3aab))
* update test ([5b379aa](https://github.com/dhis2/app-hub/commit/5b379aa6bc925d958fd9a2406b766fc1f4e30e36))
* update usage of Filter ([4f84b77](https://github.com/dhis2/app-hub/commit/4f84b772680c01aa4fb7b41b3111a9d722de3955))
* working filter ([0f23321](https://github.com/dhis2/app-hub/commit/0f2332165645c11e0fda27934194dd8c2f0d78b9))


### Features

* custom-joi filter-type ([6e675a8](https://github.com/dhis2/app-hub/commit/6e675a86f6798442b17cb9f7237ae1a7309fec65))
* **queryfilter:** enable queryFilter-plugin ([a8574f7](https://github.com/dhis2/app-hub/commit/a8574f7b5eed8c39a19bdb1946ca202d0992a912))
* filtering ([fa05623](https://github.com/dhis2/app-hub/commit/fa056237a13ac068e02a0c679b09f1fd30c81c72))

# [2.2.0](https://github.com/dhis2/app-hub/compare/v2.1.2...v2.2.0) (2020-04-20)


### Bug Fixes

* allow admins to download all apps ([c770651](https://github.com/dhis2/app-hub/commit/c770651020487a752e38818c34bc88146c574bf7))
* allow managers to patch/post organisations ([ab03046](https://github.com/dhis2/app-hub/commit/ab03046abfedbd2c9b83d9b9302f76159b937ffe))
* allow managers to upload versions to all apps ([a997a12](https://github.com/dhis2/app-hub/commit/a997a126ffa93a01a5f18baf16f24e03cbe23975))
* remove trailing incorrect } ([a099a10](https://github.com/dhis2/app-hub/commit/a099a1098bd1587b25a824fc14110d7735280eab))


### Features

* add function to fetch apps through user-orgs ([b0758f1](https://github.com/dhis2/app-hub/commit/b0758f1496f171211df109e9ac3cc8266b0887ff))

## [2.1.2](https://github.com/dhis2/app-hub/compare/v2.1.1...v2.1.2) (2020-04-16)


### Bug Fixes

* add migration to fix users with orgs-view ([4e67b74](https://github.com/dhis2/app-hub/commit/4e67b7456f9bdeb0098c9e088be290e39df1843d))

## [2.1.1](https://github.com/dhis2/app-hub/compare/v2.1.0...v2.1.1) (2020-04-02)


### Bug Fixes

* incorrect down migration ([52c0b09](https://github.com/dhis2/app-hub/commit/52c0b099418b18675f53950fe3bcba7ecbf63474))
* split media to own table/app/version ([7c5f451](https://github.com/dhis2/app-hub/commit/7c5f4513672e61004ea94aa3ce09f8a6b131b0e4))
* update apps_view to use app_media ([79c89fa](https://github.com/dhis2/app-hub/commit/79c89faf0d8d9fb3b1dff8b1442fa4e81f540c58))
