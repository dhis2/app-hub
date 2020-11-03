# [2.9.0](https://github.com/dhis2/app-hub/compare/v2.8.3...v2.9.0) (2020-11-03)


### Bug Fixes

* cleanup old spinner ([8737475](https://github.com/dhis2/app-hub/commit/873747567e1b629b0fbba3cb937436f4c8684fc8))
* **spinner:** use circularprogress for spinner instead of custom svg ([2764873](https://github.com/dhis2/app-hub/commit/2764873f22630692dede510e02e92e2342f4ad5c))


### Features

* remove node-sass ([b4496df](https://github.com/dhis2/app-hub/commit/b4496df573e8587678e2f7e91f90049bfef5425d))

## [2.8.3](https://github.com/dhis2/app-hub/compare/v2.8.2...v2.8.3) (2020-10-23)


### Bug Fixes

* React-PropTypes to proptypes package ([71ddcd6](https://github.com/dhis2/app-hub/commit/71ddcd611cb15773b2dbcdf0f7a2728e11cdc746))
* upgrade to react@16 with deps ([eee9ea7](https://github.com/dhis2/app-hub/commit/eee9ea7ded9589264543d9b6c55347315579f252))

## [2.8.2](https://github.com/dhis2/app-hub/compare/v2.8.1...v2.8.2) (2020-10-12)


### Bug Fixes

* correctly load channels, refactor version form, fix version delete ([cd5472d](https://github.com/dhis2/app-hub/commit/cd5472dc1de61c2a966f53a00398050cf8f40aaa))

## [2.8.1](https://github.com/dhis2/app-hub/compare/v2.8.0...v2.8.1) (2020-10-03)


### Bug Fixes

* downloadUrl-link ([ea2287d](https://github.com/dhis2/app-hub/commit/ea2287d690ea5452dd99d2bdbadbffa54f9d14f3))

# [2.8.0](https://github.com/dhis2/app-hub/compare/v2.7.4...v2.8.0) (2020-10-02)


### Bug Fixes

* **version:** fix UI-jump when tranisitioning between error and helptext ([b89acbf](https://github.com/dhis2/app-hub/commit/b89acbf657ea954bf2eef933cd29f079a9d71e47))
* cleanup versiofield, add link style ([204da3e](https://github.com/dhis2/app-hub/commit/204da3ed776bdcbeca48a40066621285b73ae269))
* misc form styling ([1d0b196](https://github.com/dhis2/app-hub/commit/1d0b1960aa6250a775eb049b4da38afcc623cbf3))
* textheader and helpertext styling ([d5512ea](https://github.com/dhis2/app-hub/commit/d5512ea395540940b2f25db5edf7851b1858d4a9))


### Features

* **validation:** add semver validation backend ([6aac6e1](https://github.com/dhis2/app-hub/commit/6aac6e1a36c72435c29925975788e754601adbce))
* add semver-validation on client ([d5a859c](https://github.com/dhis2/app-hub/commit/d5a859cf0f6a856f7a669af548bb1c020a1bce52))

## [2.7.4](https://github.com/dhis2/app-hub/compare/v2.7.3...v2.7.4) (2020-09-28)


### Bug Fixes

* **download:** encode download-components ([179cae4](https://github.com/dhis2/app-hub/commit/179cae458b3480ea42209d6f51808315999c9200))
* **download:** encode download-components, use / as seperators instead of _ ([44663b9](https://github.com/dhis2/app-hub/commit/44663b94328b239e7d168f01a2d802e7c528d1cb))
* **migration:** remove down migration ([b22fa9d](https://github.com/dhis2/app-hub/commit/b22fa9d6d3546f355037ff42f59c6b5d5a63e31b))
* **migration:** replace _ with . in app_version ([693cee2](https://github.com/dhis2/app-hub/commit/693cee2c0ad3f7d8edd1e25a1f596c307b6f5e60))
* **version:** prevent version to contain underscore ([90ebb36](https://github.com/dhis2/app-hub/commit/90ebb3688853cfffb1844495f484ee7b52f5989c))

## [2.7.3](https://github.com/dhis2/app-hub/compare/v2.7.2...v2.7.3) (2020-09-24)


### Bug Fixes

* add versionitems file ([c641be0](https://github.com/dhis2/app-hub/commit/c641be077bda239b608ba194cf82889ff74b802c))
* consolidate version validations ([789bfc2](https://github.com/dhis2/app-hub/commit/789bfc2e6b1302f32a4ab1f3863bed35556e7c8e))
* re-order fields to same as when creating ([3630275](https://github.com/dhis2/app-hub/commit/3630275bf43ea2bc207766ed4d03f204e49e3f91))
* **version:** use select-field when editing version ([c1e6158](https://github.com/dhis2/app-hub/commit/c1e6158926d611ecc3c90375ca0586794e70ef5e))

## [2.7.2](https://github.com/dhis2/app-hub/compare/v2.7.1...v2.7.2) (2020-09-04)


### Bug Fixes

* **apiroutes:** do not redirect 404 under /api to index ([af45fc5](https://github.com/dhis2/app-hub/commit/af45fc50c0d653469c7400b4ecd400dd01744831))
* **apiroutes:** set 404-statuscode ([8235e57](https://github.com/dhis2/app-hub/commit/8235e57ae7dabbd912f874e1412fe5e3487e871b))

## [2.7.1](https://github.com/dhis2/app-hub/compare/v2.7.0...v2.7.1) (2020-09-01)


### Bug Fixes

* prevent error when saving unmodified version ([572cd2d](https://github.com/dhis2/app-hub/commit/572cd2d4ba56cbdb7e7eb9fd02d9a700e39ce350))

# [2.7.0](https://github.com/dhis2/app-hub/compare/v2.6.4...v2.7.0) (2020-08-27)


### Bug Fixes

* improve config tests ([ccacce7](https://github.com/dhis2/app-hub/commit/ccacce74109e4041ebd082868e3013854615f54d))


### Features

* add 2.35 as supported dhis2-version ([b41e802](https://github.com/dhis2/app-hub/commit/b41e802018a19afb610928653b8d08aa3aedee8e))

## [2.6.4](https://github.com/dhis2/app-hub/compare/v2.6.3...v2.6.4) (2020-08-26)


### Bug Fixes

* allow a developer to delete his own versions ([dfaf618](https://github.com/dhis2/app-hub/commit/dfaf61803525cd019ef6c534893d96d5a43711e2))
* allow devs to delete images on own apps ([5987bd0](https://github.com/dhis2/app-hub/commit/5987bd0e41548001933f450cedc8d0d8db345958))
* allow devs to upload media to own apps ([be87503](https://github.com/dhis2/app-hub/commit/be87503c44e2104622cb1d5e7c52c5c16aa8f9f9))

## [2.6.3](https://github.com/dhis2/app-hub/compare/v2.6.2...v2.6.3) (2020-08-25)


### Bug Fixes

* change filename in download url ([658b471](https://github.com/dhis2/app-hub/commit/658b471e37fe004a8b15b8bbb11cb7adcdc1ad2e))
* use slug + version as filename on download ([23bbb04](https://github.com/dhis2/app-hub/commit/23bbb04c6f4cd6524a978adab08daa7c1d65c092))

## [2.6.2](https://github.com/dhis2/app-hub/compare/v2.6.1...v2.6.2) (2020-08-25)


### Bug Fixes

* use wildcard for matching patch-versions ([4d96a7b](https://github.com/dhis2/app-hub/commit/4d96a7bcdd6727e2aea8bb7181066c2c32a5ae55))

## [2.6.1](https://github.com/dhis2/app-hub/compare/v2.6.0...v2.6.1) (2020-08-17)


### Bug Fixes

* **createversion:** add try-catch for parsing json ([0de1a50](https://github.com/dhis2/app-hub/commit/0de1a5049c47250dbab6a47d6035d0fa51d8542d))
* fix tests ([b39bbc6](https://github.com/dhis2/app-hub/commit/b39bbc6163e47a103f2919791716c6d62dd5d0a8))
* **createappversion:** allow null demoUrl ([45acd4a](https://github.com/dhis2/app-hub/commit/45acd4ad8842b1064c342ec0d6d1a6c9219a05b6))
* **editversion:** actually allow null for demourl ([c9154e2](https://github.com/dhis2/app-hub/commit/c9154e23201803c977789403ac3c470201ae9bd4))
* **errormapper:** map Joi-errors to 400-badrequest errors ([fad7757](https://github.com/dhis2/app-hub/commit/fad775734de4bc1fa7bd85ca64d9addd8fdce063))

# [2.6.0](https://github.com/dhis2/app-hub/compare/v2.5.2...v2.6.0) (2020-06-15)


### Features

* **routes:** support for getting org by slug ([a6d27e1](https://github.com/dhis2/app-hub/commit/a6d27e1d747b591607e2f345e8393939a627aaf7))
* **services:** findOneBySlug ([16eeb8a](https://github.com/dhis2/app-hub/commit/16eeb8af99dbfe985809d6c78e2ff38cb0c2a529))
* **services:** getUsersInOrganisation function ([ce06205](https://github.com/dhis2/app-hub/commit/ce062058b5fe8875f7f8e1e54da1f67740336cd0))

## [2.5.2](https://github.com/dhis2/app-hub/compare/v2.5.1...v2.5.2) (2020-06-03)


### Bug Fixes

* add ui validation for demourl ([380b686](https://github.com/dhis2/app-hub/commit/380b68630d52387347ddbcc2c3615f0c720ad100))
* validate demoUrl/sourceUrl as URI ([4950e77](https://github.com/dhis2/app-hub/commit/4950e77835a368e5fdc8c531674ffb3932b8f03f))

## [2.5.1](https://github.com/dhis2/app-hub/compare/v2.5.0...v2.5.1) (2020-06-01)


### Bug Fixes

* edit app form tweaks ([6ce2387](https://github.com/dhis2/app-hub/commit/6ce23873b5de3b191981a12195e5d5169c8a6a05))
* pre-fill sourceUrl field when editing ([b9ebf98](https://github.com/dhis2/app-hub/commit/b9ebf988bbfae57c8a9b45a4d95ae76cf21572ec))
* save sourceUrl correctly when creating an app ([a3a4577](https://github.com/dhis2/app-hub/commit/a3a457769a046cd8a2e23bc52f788989ea77892f))

# [2.5.0](https://github.com/dhis2/app-hub/compare/v2.4.2...v2.5.0) (2020-05-12)


### Features

* **log:** log version and build date in client console ([#333](https://github.com/dhis2/app-hub/issues/333)) ([2e56852](https://github.com/dhis2/app-hub/commit/2e568520915b52800e459754d7dc359dbc6565c3))

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
