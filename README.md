## Quick start

### Prerequisites 

Before you begin, ensure that you have the following installed on your system:
* NodeJS 18+
* NPM
* Chrome or Chromium browser

### Configuration

To configure the application, follow these steps:

1. Install all dependencies:
```bash
npm run install
```

2. Create a .env file and add your personal data:
```.env
TS_USERNAME=
TS_PASSWORD=
TS_BANK_ACCOUNT_UUID=
TS_COMPANY=
TS_EMPLOYEE=
TS_CONTRACT_AMOUNT=
TS_CONTRACT_YEAR=
TS_CONTRACT_MONTH=04
TS_CONTRACT_SUBJECT=
TS_BROWSER=
TS_DOWNLOAD_PATH=
```

### Running the Application

To run the application, execute one of the commands from

Run one of specific command form [the following list](actions.ts):
```bash
node index.js -t $SPECIFIC_COMMAND
```

Make sure to replace $SPECIFIC_COMMAND with the actual command you want to execute.
