# Alumier Test
I have used two repositories to complete this test:
* https://github.com/karlito-who-else/alumier-test-shopify-theme
* https://github.com/karlito-who-else/alumier-test-node

I am aware that I was instructed to use a single repository, however I have chosen to use two repositories to allow installation of the Shopify theme to a Shopify store instance using the "Connect from GitHub" method in the Shopify store's Theme settings, which will allow automatic updates to the theme when changes are pushed to the repository.

I felt this benefit was and the knock-on effect of requiring two repositories was worth discussion, and could be potentially addressed by using separate branches of the same repository to organise the Shopify theme and node code, however I find this to be an undesirable and problematic approach to managing code clearly and efficiently.

## How to set up the environment
1. Local development
    1. Clone the repository to your local machine.
    1. Install node.js (and npm) by following the official documentation at https://nodejs.org/en/download.
    1. Install the required dependencies using one of the following methods:
        1. (recommended) Install pnpm globally on your machine by following the official documentation at https://pnpm.io/installation. e.g. install via npm by running `npm install -g pnpm`.
        pnpm is the recommended package manager for this project as there is a provided pnpm-lock.yaml file to guarantee that the same versions are used between installs.
        Once pnpm is installed, run `pnpm install` to install the required dependencies.
        1. (alternative) Run `npm install` to install the required dependencies.
    1. Create a `.env` file in the root of the repository with the following contents:
        ```sh
        SHOPIFY_ORDERS_APP_API_KEY={your-api-key}
        SHOPIFY_ORDERS_APP_API_SECRET_KEY={your-api-secret-key}
        SHOPIFY_ORDERS_ADMIN_API_ACCESS_TOKEN={your-admin-api-access-token}
        SHOPIFY_API_SCOPES=read_orders,read_products
        SHOPIFY_API_VERSION=2025-01
        SHOPIFY_STORE_URL={your-store-url}
        SHOPIFY_WEBHOOK_SECRET={your-webhook-secret}
        ```
        To locate your Shopify app's API key and secret key, navigate to the "API credentials" tab of your app's settings page at https://admin.shopify.com/store/{store-name}/settings/apps/development/{app-id}/api-keys.
1. Shopify store
    1. Create a development app
        1. Navigate to Settings > Apps and sales channels (https://admin.shopify.com/store/{store-name}/settings/apps)
        1. Click the "Develop apps" button.  You will be taken to the App development page at https://admin.shopify.com/store/{store-name}/settings/apps/development.
        1. Click the "Allow custom app development" button.  You will be asked to confirm again on a subsequent screen.
        1. Click the "Create an app" button that should now be visible on the App development page at https://admin.shopify.com/store/{store-name}/settings/apps/development.
        1. From the "Create an app" dialog, provide a name your app (I have used "Retrieve Orders" for the purposes of this test) and then click the "Create app" button.
    1. Select the relevant access scopes
        1. From the settings page for your app (e.g. https://admin.shopify.com/store/{store-name}/settings/apps/development/{app-id}/overview), navigate to the "Configuration" tab and then click the "Configure Admin API scopes" button.
        1. From the "Admin API access scopes" screen, check the checkboxes for "read_orders" and "read_products" and then click the "Save" button.
        1. From the settings page for your app, navigate to the "API credentials" tab and then click the "Install app" button.
        1. Click the "Install" button on the subsequent "Install {app name} on {store name}?" dialog.
        1. From the "API credentials" tab, click the "Reveal token once" button in the "Admin API access token" panel.  Copy this value and paste it into the `SHOPIFY_ORDERS_ADMIN_API_ACCESS_TOKEN` value in the `.env` file.  Note that this value will only be visible once, so if you lose it, you will need to regenerate a new app.

## How to run

### Liquid snippet
1. On the Sales Channels > Online Store > Themes section in a Shopify store instance (i.e. https://admin.shopify.com/store/{store-name}/themes), click the "Add theme" dropdown button in the Theme library section and then there are two choices:
    1. (recommended) Connect from GitHub
        1. On the GitHub repository's main page, click the "Fork" button and follow the instructions to fork the repository to your own GitHub account.
        1. On the Shopify page mentioned above, select "Connect from GitHub" and follow the instructions to connect the forked repository to the Shopify store.
    1. (alternative) Upload zip file
        1. On the GitHub repository's main page, click the "Code" dropdown button and then click "Download ZIP".
        1. On the Shopify page mentioned above, select "Upload zip file" and navigate to the saved location of the zip file saved from GitHub.

### GraphQL script
Run the following command in the terminal:
```sh
pnpm retrieve-orders-by-product-id
```

### webhook
Run the following command in the terminal:
```sh
pnpm webhook
```

## Assumptions made during development

### Shopify store
1. I read up on the latest relevant documentation at https://www.shopify.com/uk/partners/blog/development-stores#leveraging and https://shopify.dev/docs/api/development-stores/generated-test-data however I was not provided with a Quickstart store containing generated test data when creating the development store instance.  I suspect that I was not offered a Quickstart store because of the age of my account and the previous usage that it has had, particularly in conjunction with Partner Organisations.  The page at https://help.shopify.com/en/partners/dashboard/managing-stores/development-stores states "If a Quickstart store isn't automatically created, then you can create a development store manually.", so rather than risking a waste of time investiage this further, I proceeded with the store that I created and quickly found suitable sample data at https://github.com/shopifypartners/product-csvs.

### Environment setup

##### Node.js
1. I have used the fetch API as implemented in Node.js v21 onwards, Deno, Bun, etc. without the use of a polyfill.
1. I have installed the `@types/node` package to provide TypeScript type definitions for Node.js built-in modules.
1. I have used the `dotenv` package to load environment variables from a `.env` file.
1. I have committed the `.env` file to the repository for the purposes of this test, but in a production environment, I would would never add the credentials into the repository and I would add the file to the `.gitignore` file.  Instead, I would use a service like AWS Secrets Manager, Vercel Environment Variables, Vercel Environment Variables, etc. to store sensitive information like API keys.

#### Shopify CLI
1. I have installed the Shopify CLI globally on my machine by running `npm install -g @shopify/cli` as per the instructions at https://shopify.dev/docs/api/shopify-cli.

#### Shopify store
1. I have created a new Shopify store named `amd-test-kjp` for the purposes of this test according to the instructions at https://help.shopify.com/en/partners/dashboard/managing-stores/development-stores.

#### Shopify theme
1. I used the Shopify CLI to create a new theme based off of the default Dawn theme to one called “alumier-test-shopify-theme” according to the instructions at https://shopify.dev/docs/storefronts/themes/getting-started/create.  I would use a more descriptive name in a production environment based on the purpose of the theme, e.g. whether it would be replacing an existing theme, apply to a specific territory, etc.
1. I edited this theme in my local development environment using Visual Studio Code, which I have configured to use the Shopify Liquid extension.
1. I used the Shopify CLI to preview the theme on the Shopify store instance according to the instructions on the link mentioned above.
1. I pushed my changes to the theme to the https://github.com/karlito-who-else/alumier-test-shopify-theme repository for the purposes of this test.

### Liquid snippet
1. I added a new snippet at `snippets/badge-on-sale.liquid`.
    1. I copied the existing Liquid code for Sale badge from the `snippets/card-product.liquid` snippet, renaming all instances of the `card_product` object to the correct `product` object.
    1. I removed the reference to `section_id` from the existing code, which is not applicable in the `Default product` template.
    1. I updated the `badge--bottom-left` modifier class to `badge--top-right`
    1. I added a `{% style %}` tag instance that contains a CSS rule for `badge--top-right` to absolutely position the badge before the product title and at the end of the brand name.  I would consider investing the time to implement a more robust solution using a flex or grid layout in the future, in order to modify the layout in the event that a brand name happens to be particularly long.
1. I added a new `on_sale` sub-section of the `main` section in templates/product.json.
1. I added the new `when 'on_sale'` condition to the `sections/main-product.liquid` template to render the `badge-on-sale` snippet created above.
1. I edited the value for the `products.product.on_sale` translation key in the theme’s default language file at `locales/en.default.json` from “Sale” to “On Sale” so the messaging is consistent across all instances of the sale badge, including the existing one in `snippets/card-product.liquid`.