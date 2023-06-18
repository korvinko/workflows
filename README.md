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
TS_INVOICE_YEAR=
TS_INVOICE_MONTH=
TS_INVOICE_TRANSFER_TYPE=
TS_INVOICE_TRANSFER_CURRENCY=
TS_INVOICE_TRANSFER_CURRENCY_RATE=
TS_INVOICE_TRANSFER_CURRENCY_BANK_ACCOUNT=
TS_INVOICE_PRODUCT_NAME=
TS_COMPANY=
TS_BANK_ACCOUNT_UUID=
TS_CONTRACT_AMOUNT=
TS_CONTRACT_YEAR=
TS_CONTRACT_MONTH=
TS_CONTRACT_SUBJECT=
TS_BROWSER=
TS_DOWNLOAD_PATH=
OPENAI_API_KEY=
TS_PROMT_TEXT=
```

3. Example of .env file:
```.env
TS_USERNAME=john.doe@gmail.com
TS_PASSWORD=SUPER_STRONG_PASSWORD
TS_INVOICE_YEAR=2023
TS_INVOICE_MONTH=06
TS_INVOICE_TRANSFER_TYPE=foreign
TS_INVOICE_TRANSFER_CURRENCY=a1f864c9-5abd-468c-8b1f-6ca96b134c75
TS_INVOICE_TRANSFER_CURRENCY_RATE=4.2399
TS_INVOICE_TRANSFER_CURRENCY_BANK_ACCOUNT=a36eba24-1a9c-48be-8207-07a3ebd407c0
TS_INVOICE_PRODUCT_NAME=Software Development (XXX Team) / usługi programistyczne
TS_COMPANY=XXX Finance Inc
TS_BANK_ACCOUNT_UUID=4857d455-d368-488a-88a4-f4ff54d95de8
TS_CONTRACT_AMOUNT=1500
TS_CONTRACT_YEAR=2023
TS_CONTRACT_MONTH=03
TS_CONTRACT_SUBJECT=Stworzenie autorskiego kodu źródłowego w języku XXX dla aplikacji "YYY"
TS_BROWSER=/snap/bin/chromium
TS_DOWNLOAD_PATH=/home/user/Downloads/
TS_CODE_HTML_FOLDER=/home/user/code_in_html_output
OPENAI_API_KEY=sk-1derHS11IdYobr7Aw2dTaWBlbkFJCtWREXcElo8QgdrOO16a
TS_PROMT_TEXT=Creating source code in XXX for the "XXX" module for the "XXX" mobile application.\nIt must be completed application with no less then 50 pages of code in A4.\nIt can be code, gRPC schema, services, models, tests, mongodb migration and so on.\nApplication should follow DDD principle and have isolation between layers.\nIn main file use dependency injection uber-go/fx.\nIt must have prometheus metrics, go tests and http router, grpc handler, code for tracing.\nStart from providing me the whole list of files of this application.\nPlease generate structure with more than 40 files.\n
```

### Running the Application

To run the application, execute one of the commands from

Run one of specific command form [the following list](actions.ts):
```bash
node index.js -t $SPECIFIC_COMMAND
```

Make sure to replace $SPECIFIC_COMMAND with the actual command you want to execute.
