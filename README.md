# Spare Part Recognition - A Simple Image Classification Integration between SAP Business One / ByDesign

![avatar](https://jam4.sapjam.com/profile/vQ2WGFrz1l1cmyPIZX6G8c/documents/exUx6J98mB0A3RqbVkE0W1/thumbnail?max_x=1200&max_y=1200)

This is a sample integration of SAP Business One or SAP Business ByDesign with the pretrained ImageNet dataset leveraging Tensorflow. It uses Tensorflow to extract the features vectors of a given input product image and then find out the smiliar items base on a pretrained base model (and pretrained weights) provided by the ImageNet dataset.

## Overview

- It is coded in [NodeJS](https://nodejs.org/en/)
- Can be deployed anywhere and I suggest to do it in the  [SAP Business Technology Platform](https://www.sap.com/products/business-technology-platform/products.html).  
- It is integrated with [SAP Business One](https://www.sap.com/products/business-one.html) using the [Service Layer](https://www.youtube.com/watch?v=zaF_i7x9-s0&list=PLMdHXbewhZ2QsgYSICRQuoL8lkoEHjNzS&index=22) or [SAP Business ByDesign](https://www.sap.com/products/business-bydesign.html) using the [OData API](https://blogs.sap.com/2015/03/10/odata-for-sap-business-bydesign-analytics/).
- It leveraging [Tensorflow](https://www.tensorflow.org/tutorials/images/transfer_learning) to classify images.

## Installation in the Cloud

Install [git-lfs](https://github.com/git-lfs/git-lfs/wiki/Installation)

```sh
git lfs install
```

Clone this repository

```sh
git clone https://github.com/CyranoChen/spare-parts-recognition
```

Optional: Give a name to client and server app in the manifest.yml file inside both folders

From the **server** directory, using the [Cloud Foundry CLI](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html) push your app to the SAP BTP Cloud Foundry

```sh
cf push
```

The Tensorflow installation requires 2 GB of memory, you can decrease the amount of assigned memory **after** the app has been pushed, by using the command:

```sh
cf scale spare-parts-recognition-server -m 1G
```

Copy the URL route shown in the terminal as required for the CNN_SERVER_ENDPOINT variable

From the **client** directory, set the global variables configuration in the [manifest.yml](https://github.com/CyranoChen/spare-parts-recognition/blob/master/client/manifest.yml)

This project depends on an instance of B1 HANA environment and set the adminstrator account for accessing the service layer.

```sh
B1_SERVICELAYER_APIURL: https://<B1 hostname>:50000/b1s/v1 
B1_USERNAME: <username> 
B1_PASSWORD: <password>
B1_COMPANYDB: <companydb>
```

This project also integrate with an instance of ByDesign and set the adminstrator account for accessing the odata api of product data.

The odata api [configuration profile](vmumaterial.xml) should be imported by custom odata services.

```sh
BYD_TENANT_HOSTNAME: https://<ByDesign Tenant>/sap/byd/odata/cust/v1 
BYD_USERNAME: <username> 
BYD_PASSWORD: <password>
```

Paste the URL route shown from the server and append "/api"

```sh
CNN_SERVER_ENDPOINT: <server app address>/api
```

From the **client** directory, using the [Cloud Foundry CLI](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html) push your app to the SAP BTP Cloud Foundry

```sh
$ cf push
or
$ cf push --random-route
–random-route will avoid name collisions with others that deploy this same app on SCP. You can also choose your own app name by changing the manifest.yml file.
```

Access the app from the URL route shown in the terminal

## Demo app

There is a sample implementation [running here](https://spare-parts-recognition.cfapps.eu10.hana.ondemand.com/). Be advised that the B1 System Backend is not running 24/7

## License

This code snippet is released under the terms of the MIT license. See [LICENSE](LICENSE) for more information or see <https://opensource.org/licenses/MIT>.
