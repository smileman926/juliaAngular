# Julia

## Start locally (without server)

### Preparations (first time only)

- Copy /proxy.conf-sample.json to /proxy.conf.json and optionally change its contents based on your settings
- Login on https://test-eb-3.easy-booking.at/login_DEV/
  - Copy content of the juliaAngularToken cookie
- Copy /src/environments/environment.ts to /src/environments/environment-local.ts
  - Remove apiUrl
  - Add token and set it to the value of juliaAngularToken
  - Add remoteUrlToSetToken if using iframes from test-eb-3 and set it to 'https://test-eb-3.easy-booking.at/jat.php?token={{TOKEN}}'

### Run server
```bash
npm run start -c local
```

## Start locally with https (without server)

### Preparations (first time only)

Copy proxy.conf-sample.json to proxy.conf.json and change its contents based on your settings.

Add certificate as trusted root certificate to your system
 * On Windows
   1. Launch `mmc`
   2. Choose *File > Add/Remove Snap-ins*
   3. Choose *Certificates*, then *Add*
   4. Choose *Computer Account*
   5. Press *OK*
   6. On the left side find *Certificates (Local machine) > Trusted root certificates > Certificates*
   7. Right click, then select *All Tasks > Import*
   8. Press *Next*, then select the *ssl/localhost.crt* from the project folder, then press *Next* until the final screen says *Finish*
 * On Linux
   * ...to be added
 * On MacOS
   * ...to be added

Add entries to your hosts file:
 * easybooking.host pointing to 127.0.0.1
 * optionally easybooking.dev pointing to your development api server

### Starting the server

```bash
npm run start:localssl
```

The application can be accessed on https://easybooking.host:4200

## Build

- for general use: run `npm run build`
- for staging: run `npm run build:staging`
- for production: run `npm run build:prod`

## Deploy

The application is auto-deployed when merging to specific branches:

 - develop: https://test-eb-3.easy-booking.at/julia_DEV
 - staging: https://test-eb-3.easy-booking.at/julia
 - master: https://gsrv001.easy-booking.at/julia & https://gsrv002.easy-booking.at/julia
