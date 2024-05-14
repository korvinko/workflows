## Quick start

### General information
This application is a handy tool for TwojStartup contractors. It can help you with routine tasks like generating invoices, contracts, and building prototypes for your projects, significantly reducing delivery time to production.  
It's integrated with the OpenAI API, so it can generate code for you based on the prompt you provide, and it can also sign documents for you.  
Generation options are semi-automatic, allowing you to review and change generated data before it is saved to TS. After clicking on the "Send" button, you will be redirected to the Sejda service, which helps you sign documents.  

Feel free to use it as you wish and contribute to this project or fork it to create your own version for your specific needs.

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
# TwojSturtup credentials
TS_USERNAME=
TS_PASSWORD=

# TwojSturtup invoice
TS_INVOICE_YEAR=
TS_INVOICE_MONTH=
TS_INVOICE_TRANSFER_TYPE=
TS_INVOICE_TRANSFER_CURRENCY_CODE=
TS_INVOICE_TRANSFER_CURRENCY_TITLE=
TS_INVOICE_TRANSFER_BANK_ACCOUNT=
TS_INVOICE_PRODUCT_NAME=
TS_COMPANY=

# TwojSturtup contract
TS_CONTRACT_TYPE=
TS_CONTRACT_BANK_ACCOUNT=
TS_CONTRACT_YEAR=
TS_CONTRACT_MONTH=
TS_CONTRACT_SUBJECT_DZIELO=
TS_CONTRACT_AMOUNT_DZIELO=
TS_CONTRACT_SUBJECT_ZLECENIE=
TS_CONTRACT_AMOUNT_ZLECENIE=

# Local configuration
TS_BROWSER=
TS_DOWNLOAD_PATH=

#Groq configuration
GROQ_MODEL=llama3-70b-8192
GROQ_API_KEY=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

# OpenAI configuration
OPENAI_API_KEY=
TS_PROMT_TEXT=
TS_CODE_HTML_FOLDER=
```

3. Example of .env file:
```.env
# TwojSturtup credentials
TS_USERNAME=john.doe@gmail.com
TS_PASSWORD=SUPER_STRONG_PASSWORD

# TwojSturtup invoice
TS_INVOICE_YEAR=2023
TS_INVOICE_MONTH=06
TS_INVOICE_TRANSFER_TYPE=foreign
TS_INVOICE_TRANSFER_CURRENCY_CODE=USD
TS_INVOICE_TRANSFER_CURRENCY_TITLE=Dolar amerykański
TS_INVOICE_TRANSFER_BANK_ACCOUNT=mBank (USD)
TS_INVOICE_PRODUCT_NAME=Software Development (Telecom Team) / usługi programistyczne
TS_COMPANY=XXX Finance Inc

# TwojSturtup contract
# TS_CONTRACT_TYPE = 2 - umowa zlecenie, 3 - umowa o dzieło
TS_CONTRACT_TYPE=2
TS_CONTRACT_BANK_ACCOUNT=90224020040000414213110801
TS_CONTRACT_YEAR=2023
TS_CONTRACT_MONTH=05
TS_CONTRACT_SUBJECT_DZIELO=Stworzenie autorskiego kodu źródłowego w języku Go do modułu "user" dla aplikacji mobilnej "Fin"
TS_CONTRACT_AMOUNT_DZIELO=12880
TS_CONTRACT_SUBJECT_ZLECENIE=Testowanie oprogramowania komputerowego
TS_CONTRACT_AMOUNT_ZLECENIE=141

# Local configuration
TS_BROWSER=/snap/bin/chromium
TS_DOWNLOAD_PATH=/home/user/Downloads/

# OpenAI configuration
OPENAI_API_KEY=sk-1derHS22IdYobr7Aw2dTaXClbkFJDtWREXcAlo1QgdrOO16b
TS_PROMT_TEXT=Creating source code in XXX for the "XXX" module for the "XXX" mobile application.\nIt must be completed application with no less then 50 pages of code in A4.\nIt can be code, gRPC schema, services, models, tests, mongodb migration and so on.\nApplication should follow DDD principle and have isolation between layers.\nIn main file use dependency injection uber-go/fx.\nIt must have prometheus metrics, go tests and http router, grpc handler, code for tracing.\nStart from providing me the whole list of files of this application.\nPlease generate structure with more than 40 files.\n
TS_CODE_HTML_FOLDER=/home/user/code_in_html_output
```

.env file is grouped by sections, so it's easier to understand what data is required for specific a command

### Running the Application

To run the application, execute one of the commands from

Run one of specific command form [the following list](actions.ts):
```bash
node index.js -t $SPECIFIC_COMMAND
```

Make sure to replace $SPECIFIC_COMMAND with the actual command you want to execute.

Alternatively you can use npm shortcut from [package.json](package.json):
```bash
npm run $SPECIFIC_COMMAND
```

Don't forget to provide appropriate data in .env file.

### Code generation

Code generation gives you the ability to create scaffolding for your projects and reduces the delivery time to production.

Run one of specific command form [the following list](actions.ts):
```bash
npm run code
```
