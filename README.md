# DNS Resolver Microservice

## Description

This microservice validates SPF, DKIM, and DMARC records for a list of domain names. It runs periodically and exposes the results via a RESTful API.

## Setup and Run

1. **Clone the repository:**

   ```sh
   git clone https://github.com/abdulrcs/coldsire-dns-resolver.git
   cd coldsire-dns-resolver
   ```

2. **Install dependencies:**

   ```sh
   bun install
   ```

3. **\_Setup .env variable for DB_URL (MongoDB URI) and PORT (3000)**

4. **Add `domain_names.csv` under the dataset/ folder**

5. **Run the service locally:**

   ```sh
   bun start
   ```

6. **Access the results:**
   Open your browser or use a tool like Postman to access GET `/api/domains`

## Notes

- The DNS validation runs everyday at midnight or you can access it manually via POST `/api/domains/check`
