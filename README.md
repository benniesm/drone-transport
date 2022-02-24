# drone-transport-benjamin-adegbaju

 **the drone** Rest API service


## Introduction

This API service provides endpints for storing drones information, medications, and loading drones with medications.

### The Tech Stack

This is a Node.js application. It uses express.js server to execute requests, and sqlite database.

## Available Scripts

In the project directory, you can run:

### `yarn init-app`

Clears any exiting databse and creates a new one which will be populated with sample data.

### `yarn start`

Runs the application, and the server is started. By default it listens to PORT 4000

## Assumptions
* The serial number column 'serialNumber' is unique for all entries.
* The code column 'code' for medications is also unique for all entries.
* Label images for medications are not stored directly into the database. Their absolute URLs are stored instead as string.

## API Documentation

All endpoints accept and return JSON string
The following endpoints are available:

### `/drones`

#### Method: `GET: /`
This endpoint returns all data for all drones registered on the database.

#### Method `GET: /available`
Returns all data for drones whose states are 'IDLE'.

#### Method `GET: /drone/:serial`
Returns all data for one drone with the serial number provided.
* URL suffix: serial number of a drone

#### Method `GET: /drone/battery/:serial`
Returns the current battery level percentage of one drone.
* URL suffix: serial number of a drone

#### Method `POST: /`
Inserts a new drone record with the provided data.
* Request Body Parameters
  * [serialNumber] : [string]
  * [model] : [string]
  * [weightLimit] : [integer]
  * [batteryCapacity] : [integer]
  * [state] : [string]

  ### `/medications`

  #### Method `GET: /`
  Returns all data for all medications.

  #### Method `GET: /:code`
  Returns all data for one medication whose code is being queried.
  * URL suffix: Medication code

  #### Method `POST: /`
  Inserts a new record for a medication
  * Request Body Parameters
    * [code] : [string]
    * [name] : [string]
    * [weight] : [integer]
    * [imageUrl] : [string]

### `/loader`

#### `GET: /:droneId`
Returns all load information from one drone. It lists all medications loaded on a drone.
* URL suffix: serial number of a drone

#### `POST /:droneId`
Loads a drone with medication.
* Request Body Parameters
  * [medCode] : [string]
  * [units] : [integer]


## `Commit History`
