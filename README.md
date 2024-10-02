# ReportIt

## Overview
**ReportIt** is a decentralized anonymous crime reporting app developed as part of a university hackathon. The application allows users to report crimes safely and anonymously, utilizing cutting-edge web technologies.

## Features
- **Decentralized Reporting**: Leverages decentralized technologies for secure and anonymous reporting.
- **Cross-Platform**: Built with Capacitor for seamless deployment on both web and Android.

## Tech Stack
- **Framework**: Svelte
- **Framework7**: For UI components and routing
- **Capacitor**: For mobile platform support
- **Gun.js**: For decentralized database

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (>= 12.x)
- npm (comes with Node.js)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/isitraghav/reportit.git
   cd reportit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add the Android platform for Capacitor:
   ```bash
   npx cap add android
   ```

### Running the Application
To start the development server, use:
```bash
npm run dev
```

### Building for Production
To build the web app for production, run:
```bash
npm run build
```

### Building for Android
To build the app and copy it to the Android Capacitor project, run:
```bash
npm run build-capacitor-android
```

### Assets Management
- **Custom Icons & Splash Screens**: Replace images in the `assets-src` folder and generate new assets:
   ```bash
   framework7 assets
   ```
   or launch the UI:
   ```bash
   framework7 assets --ui
   ```

- **Capacitor Assets**: Generate mobile app assets:
   ```bash
   npx cordova-res
   ```

## Documentation & Resources
- [Framework7 Core Documentation](https://framework7.io/docs/)
- [Framework7 Svelte Documentation](https://framework7.io/svelte/)
- [Framework7 Icons Reference](https://framework7.io/icons/)
- [Capacitor Documentation](https://capacitorjs.com/docs)

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License.

## Acknowledgments
Special thanks to the Framework7 and Capacitor communities for their support and resources.

---