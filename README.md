# Foodle - Open Source Restaurant Chatbot 🍔🤖

Welcome to Foodle, your open-source restaurant chatbot! This project simplifies the food ordering experience, providing a seamless way to explore menus, place orders, and track your food. Developed for the 2023 OpenShift Hackathon, Foodle aims to enhance the dining experience with Rasa-powered simplicity.

## Features

- **Menu Exploration**: Effortlessly browse through the restaurant's menu.
- **Order Placement**: Customize your orders with ease.
- **Delivery Tracking**: Track the status of your food delivery.

## Tech Stack


 <img height="12" width="auto" alt="image" src="https://github.com/N-ckDotCom/Foodle/assets/93934484/608b5e9f-45f2-43f7-98d5-29b12c96e569"> **Svelte**: A modern JavaScript framework for building user interfaces.
 
<img height="12" width="auto" alt="image" src="https://github.com/N-ckDotCom/Foodle/assets/93934484/8d9d45ed-03bb-4fb7-be24-e1a73252bc51"> **Node.js**: JavaScript runtime for server-side development.

<img height="12" width="auto" alt="image" src="https://github.com/N-ckDotCom/Foodle/assets/93934484/111de971-d411-4705-abc9-4180f7c924ca"> **Rasa**: Powering natural language understanding and chatbot interactions.

<img height="12" width="auto" alt="image" src="https://github.com/N-ckDotCom/Foodle/assets/93934484/a3daa809-42cc-4adc-a091-fc933f639fe8)"> **Redis**: In-memory data structure store used for caching.

*In the current version all redis related code is commented out. This is because of limitations on my end regarding OpenShift.*

## System Architecture

<img width="490" alt="image" src="https://github.com/N-ckDotCom/Foodle/assets/93934484/55df5ef1-cd2e-417a-984a-39682fe9b969">

Source: https://isoflow.io

## Deployment Guide

To deploy to OpenShift make sure you have `oc` installed and are logged in, then run the `kubernetes/deploy.sh` file. You may need to wait for the nlu-model-api to fully start.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
