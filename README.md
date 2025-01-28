# FabricFlow - Fabric & Pattern Management for Sewing Enthusiasts  

FabricFlow is a web application designed to centralize fabric and sewing pattern management for sewing enthusiasts. It simplifies the process of organizing fabrics, patterns, and projects, making it easier to access and share sewing resources.  

## Key Features  
- **OCR for Sewing Patterns:** Extracts data from sewing patterns automatically.  
- **Fabric & Pattern Management:** Organizes fabric inventory and patterns.  
- **Project Management:** Allows users to track and manage sewing projects.  
- **Collaborative Features:** Users can share patterns and collaborate on projects.  
- **Google Maps Integration:** Find stores selling fabrics with location data.  

## Tech Stack  
- **Frontend:** React/Next.js, Tailwind CSS  
- **Services:** Node.js, node-tesseract (OCR)  
- **Backend:** Java Spring  
- **Database:** PostgreSQL  
- **Authentication:** JWT, BCrypt  

## Comparison with Competitors  
- **Trello:** Flexible but lacks specialized features for sewing inventory management.  
- **StashHub:** Offers social features but lacks OCR, pattern sharing, and community engagement.  
- **BackStitch:** Great for fabric management and social features, but lacks OCR and store integrations.

## Getting Started  

### Easy Clone Script  
Clone the repo and install dependencies:  
```bash  
git clone https://github.com/niomedev/sewjo  
cd ./sewjo/client  
npm install  
cd ../server  
npm install  
cd ./src  
node app  
```  

Start the client in a second terminal:  
```bash  
cd ./sewjo/client  
npm run dev  
```  

### Running Client & Server  <<<
Run both the client and server in their respective folders:  ```
```bash  
npm run dev  
# or  
yarn dev  
# or  
pnpm dev  
# or  
bun dev  
```  

## Using Docker with Docker Compose  

To run Sewjo using Docker, use the following steps:  

1. Ensure Docker and Docker Compose are installed:  
   - Docker: Install [Docker](https://www.docker.com/get-started)  
   - Docker Compose: Install [Docker Compose](https://docs.docker.com/compose/install/)  

2. Navigate to the project directory:  
   ```bash  
   cd /path/to/your/repo  
   ```  

3. Start the services:  
   ```bash  
   docker-compose up  
   ```  

This will build and start all the services defined in the `docker-compose.yml` file.

## Learn More  
Tentative Stack:  
- **Frontend:** TypeScript, React/Next.js, Tailwind  
- **Services:** Node.js, node-tesseract  
- **Backend:** Java Spring  
- **Database:** PostgreSQL  
