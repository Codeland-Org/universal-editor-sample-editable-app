# Adobe Universal Editor Sample App (Next.js)

This is a sample Next.js application demonstrating how to integrate and use the Adobe Universal Editor with an AEM headless backend. 

## Local Development with Universal Editor

To run this application locally and edit it using the Universal Editor, follow these steps:

### Prerequisites

1. **AEM Local Instance**: An AEM 6.5 or AEM as a Cloud Service (AEMCS) local SDK instance running locally.
2. **HTTPS Configuration**: AEM must be configured to run on HTTPS (e.g., `https://localhost:8443`). See [Configuring AEM for HTTPS](#configuring-aem-for-https) below for detailed steps.
3. **Content**: Ensure you have the latest WKND Site or the appropriate headless models/content installed on your local AEM instance.
4. **Universal Editor CORS Proxy**: You must install the AEM Universal Editor CORS proxy bundle on your local AEM instance to bypass CORS restrictions when the editor runs locally.
   - **Installation**: Upload and install the bundle `universal-editor-service-proxy.core-1.0.0.jar` found in the `CORS Proxy` folder via the [AEM System Console (Bundles)](http://localhost:4502/system/console/bundles).
   - **Configuration**: After installation, go to the [AEM Configuration Manager](http://localhost:4502/system/console/configMgr) and look for "Universal Editor Service Proxy Configuration". Ensure the settings match your local environment (e.g., AEM Host, allowed origins).

### Configuring AEM for HTTPS

To enable HTTPS on your local AEM instance, follow these steps:

1. **Generate SSL Certificates**
   Run the following commands in your terminal to create the necessary keys and certificates:

   ```bash
   # Create Private Key
   openssl genrsa -aes256 -out localhostprivate.key 4096

   # Generate Certificate Signing Request using private key
   openssl req -sha256 -new -key localhostprivate.key -out localhost.csr -subj "/CN=localhost"

   # Generate the SSL certificate and sign with the private key (valid for 1 year)
   openssl x509 -req -days 365 -in localhost.csr -signkey localhostprivate.key -out localhost.crt

   # Convert Private Key to DER format (required by AEM SSL wizard)
   openssl pkcs8 -topk8 -inform PEM -outform DER -in localhostprivate.key -out localhostprivate.der -nocrypt
   ```

2. **Configure SSL in AEM**
   - Login to AEM: [http://localhost:4502/aem/start.html](http://localhost:4502/aem/start.html)
   - Go to **Tools > Security > SSL Configuration**.
   - Provide passwords for the **Key store** and **Trust store** (e.g., `admin`).
   - In the **Keys and Certificate** section:
     - Select the `localhostprivate.der` file for the key.
     - Select the `localhost.crt` file for the certificate.
   - In the next section, enter the domain (`localhost`) and leave the port as is (usually `8443`).
   - Click **Done**. AEM will now be accessible via HTTPS at [https://localhost:8443](https://localhost:8443).


### Environment Configuration

For local development, the application uses the `.env.local` file. Ensure it contains the appropriate variables for your local setup. Example:

```env
NEXT_PUBLIC_AEM_ACCESS_TOKEN="admin:admin"
NEXT_PUBLIC_AEM_HOST="https://localhost:8443"
NEXT_PUBLIC_UE_SERVICE="https://localhost:8000"
NODE_TLS_REJECT_UNAUTHORIZED=0
```

- `NEXT_PUBLIC_AEM_HOST`: Points to your local AEM author instance.
- `NEXT_PUBLIC_AEM_ACCESS_TOKEN`: The credentials (e.g., Basic Auth or Bearer token) needed to fetch content from your local AEM instance.
- `NEXT_PUBLIC_UE_SERVICE`: Points to the local Universal Editor service if you are running it locally.

### Running the App Locally

To start the Next.js development server specifically configured for a local AEM instance:

```bash
npm run dev:local
```

**Note:** The `dev:local` script automatically includes a local CA certificate (`NODE_EXTRA_CA_CERTS=certificates/localhost.pem`) and enables experimental HTTPS in Next.js (`--experimental-https`). This is required to resolve local SSL certificate errors when fetching data from AEM over HTTPS on localhost.

The app will be available at [https://localhost:3000](https://localhost:3000).

### Local Universal Editor Service Proxy

If you are running the Universal Editor service proxy locally, you must create and trust a local certificate before starting the service:

1. **Generate a local certificate:**
   ```bash
   openssl req -x509 -newkey rsa:2048 -keyout key.pem -out certificate.pem -days 365 -nodes -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
   ```
2. **Trust the certificate on your system (macOS):**
   ```bash
   sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain certificate.pem
   ```
3. **Configure the local Universal Editor service:**
   Create a `.env` file in the root of the project with the following content:

   ```env
   UES_PORT=8000
   UES_PRIVATE_KEY=./key.pem
   UES_CERT=./certificate.pem
   UES_TLS_REJECT_UNAUTHORIZED=false
   UES_CORS_PRIVATE_NETWORK=false
   UES_DISABLE_IMS_VALIDATION=true
   UES_LOG_LEVEL=debug
   NODE_TLS_REJECT_UNAUTHORIZED=0
   ```

4. **Start the local Universal Editor service:**
   ```bash
   node universal-editor-service.cjs
   ```

### Opening in Universal Editor

1. Open the Universal Editor. Ensure your local Universal Editor service proxy is running (e.g., at `https://localhost:8000`).
2. Point the Universal Editor to your local Next.js app URL: `https://localhost:3000`.
3. You can now edit the Next.js application in context. The changes will be pushed back to your local AEM instance at `https://localhost:8443`.

## Available Scripts

In the project directory, you can run:

### `npm run dev:local`
Runs the app in development mode, tailored for localhost. It injects local certificates to bypass SSL connection errors when communicating with local AEM over HTTPS.

### `npm run dev:sandbox`
Runs the app using configurations defined in `.env.sandbox`. Useful when connecting to a remote sandbox AEM environment instead of localhost.

### `npm run build`
Builds the Next.js app for production to the `.next` folder.

### `npm run start`
Starts the built Next.js application in production mode.

### `npm run deploy`
Builds the application and deploys it to GitHub Pages.