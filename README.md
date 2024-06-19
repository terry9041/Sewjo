# Sewjo
Sewjo is a web application created to allow sewing enthusiasts to centralize their fabric and
fabric pattern management. One common issue among those who sew is the inability to keep all
their resources managed in one place; many people disperse their inventories using manual
systems such as notes or spreadsheets, which leads to difficulty in managing all of the different
resources. On top of this, finding common sewing patterns can be difficult to access without the
right connections, which can be easily solved by centralizing the sewing patterns shared on the
website. Sewjo is a tool which will allow people who sew more streamlined access to their
inventories by centralizing one's fabrics, patterns, and projects into a single, cohesive platform.

Sewing enthusiasts currently have some competitive markets on the option which have the
capabilities to rival Sewjo, such as Trello, StashHub, and BackStitch; however, there are some
shortcoming to these existing products.

Firstly, Trello boards are used to manage sewing patterns and fabrics. Even thogh Trello is
extremely flexible and comes with some great collaboration tools, it is not explicitly designed to
manage sewing inventories; this leads to it being a weaker solution as enthusiasts are left lacking
features such as focused tools, such as project management, fabric sorting, and quick setup.
StashHub is a prevalent fabric organization app that exists to allow quick storage and access to
sewing inventories, and has many social media focused features such as the ability to share
stashes with friends. However, StashHub lacks widespread community engagement, an OCR for
storing fabric patterns, and pattern sharing abilities.

BackStitch is another fabric management app that is designed to easily manage your sewing
inventories and has many sewing community related features, such as the ability to share
patterns; the app also tracks many things, such as fabric measurements, and has creative features
such as an inspiration board. BackStitch falls short when it comes to its ability to add patterns
quickly as it lacks OCR, and does not have community engagement outside of its social
platform. On top of this, there is no specific integration with stores, so users cannot easily
purchase a necessary fabric.

Sewjo's epics will include the ability to manage user accounts, fabrics, patterns, projects, and
will be aided by OCR technologies and collaborative features. Sewjo will leverage OCR in order
to extract data from sewing patterns uploaded by a user, which is much easier than manually
entering in the sewing patterns. Users will be able to add notes to patterns and projects, which
will allow the accessing users (such as the community) to easily find relevant, important
information about using a pattern or replicating a project. It will also have Google Maps
integrations, which will allow partnered stores to easily be searched and purchased from when a
certain fabric is selected to be bought.

Sewjo's OCR will be implemented via a Express.js service, where we will connect an in-house
API to node-tesseract, and use it to extract text from uploaded images. The Google Maps API
will also be used for searching the location of the nearest store.

Sewjo's backend will be created using Java Spring and PostgreSQL. It will use CORS and JWT,
and BCrypt to ensure that the API is not only secure, but that user data is safely held.

Sewjo's frontend will be built using Next.js for creating a reactive website, while using CSS3 and
Tailwind CSS for styling the webpages.

## Getting Started
First, run the client & server via in their respectitive folders:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Learn More

Tentative stack Stack:

- Frontend : TS, React/Next, Tailwind
- Services : Node.js, Node-teserract
- Backend : Java Spring
- Database : PostgreSQL

## ez clone script
First Terminal
```bash
git clone https://github.com/niomedev/sewjo
cd ./sewjo/client
npm i
cd ../server
npm i
cd ./src
node app
```

Second Terminal
```bash
cd ./sewjo/client
npm run dev
```
