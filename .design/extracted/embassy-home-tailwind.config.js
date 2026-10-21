/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
    colors: {
        primary: {
            '50': 'hsl(49, 88%, 97%)',
            '100': 'hsl(49, 88%, 94%)',
            '200': 'hsl(49, 88%, 86%)',
            '300': 'hsl(49, 88%, 76%)',
            '400': 'hsl(49, 88%, 64%)',
            '500': 'hsl(49, 88%, 50%)',
            '600': 'hsl(49, 88%, 40%)',
            '700': 'hsl(49, 88%, 32%)',
            '800': 'hsl(49, 88%, 24%)',
            '900': 'hsl(49, 88%, 16%)',
            '950': 'hsl(49, 88%, 10%)',
            DEFAULT: '#f3d34a'
        },
        secondary: {
            '50': 'hsl(212, 71%, 97%)',
            '100': 'hsl(212, 71%, 94%)',
            '200': 'hsl(212, 71%, 86%)',
            '300': 'hsl(212, 71%, 76%)',
            '400': 'hsl(212, 71%, 64%)',
            '500': 'hsl(212, 71%, 50%)',
            '600': 'hsl(212, 71%, 40%)',
            '700': 'hsl(212, 71%, 32%)',
            '800': 'hsl(212, 71%, 24%)',
            '900': 'hsl(212, 71%, 16%)',
            '950': 'hsl(212, 71%, 10%)',
            DEFAULT: '#0b2440'
        },
        accent: {
            '50': 'hsl(355, 61%, 97%)',
            '100': 'hsl(355, 61%, 94%)',
            '200': 'hsl(355, 61%, 86%)',
            '300': 'hsl(355, 61%, 76%)',
            '400': 'hsl(355, 61%, 64%)',
            '500': 'hsl(355, 61%, 50%)',
            '600': 'hsl(355, 61%, 40%)',
            '700': 'hsl(355, 61%, 32%)',
            '800': 'hsl(355, 61%, 24%)',
            '900': 'hsl(355, 61%, 16%)',
            '950': 'hsl(355, 61%, 10%)',
            DEFAULT: '#9f2732'
        },
        'neutral-50': '#ffffff',
        'neutral-100': '#000000',
        'neutral-200': '#5a7189',
        'neutral-300': '#91a4bb',
        'neutral-400': '#52637a',
        'neutral-500': '#465c74',
        background: '#ffffff',
        foreground: '#000000'
    },
    fontFamily: {
        sans: [
            'Public Sans',
            'sans-serif'
        ],
        heading: [
            'Merriweather',
            'sans-serif'
        ],
        font2: [
            'Arial',
            'sans-serif'
        ]
    },
    fontSize: {
        '23': [
            '23px',
            {
                lineHeight: '23px'
            }
        ],
        '24': [
            '24px',
            {
                lineHeight: '24px',
                letterSpacing: '-0.09px'
            }
        ],
        '26': [
            '26px',
            {
                lineHeight: '29.9px',
                letterSpacing: '-0.09px'
            }
        ],
        '28': [
            '28px',
            {
                lineHeight: 'normal',
                letterSpacing: '1.68px'
            }
        ],
        '30': [
            '30px',
            {
                lineHeight: 'normal',
                letterSpacing: '0.6px'
            }
        ],
        '31': [
            '31px',
            {
                lineHeight: 'normal',
                letterSpacing: '-0.09px'
            }
        ],
        '34': [
            '34px',
            {
                lineHeight: 'normal',
                letterSpacing: '1.7px'
            }
        ],
        '40': [
            '40px',
            {
                lineHeight: '46.4px',
                letterSpacing: '-0.48px'
            }
        ],
        '38.48': [
            '38.48px',
            {
                lineHeight: '41.5584px',
                letterSpacing: '-1.00048px'
            }
        ],
        '30.36': [
            '30.36px',
            {
                lineHeight: '34.3068px',
                letterSpacing: '-0.78936px'
            }
        ],
        '28.8': [
            '28.8px',
            {
                lineHeight: '33.12px',
                letterSpacing: '-0.288px'
            }
        ],
        '24.8': [
            '24.8px',
            {
                lineHeight: '31px',
                letterSpacing: '-0.09px'
            }
        ],
        '23.68': [
            '23.68px',
            {
                lineHeight: '30.784px',
                letterSpacing: '-0.1184px'
            }
        ],
        '22.68': [
            '22.68px',
            {
                lineHeight: '29.484px',
                letterSpacing: '-0.1134px'
            }
        ],
        '22.4': [
            '22.4px',
            {
                lineHeight: '28.672px',
                letterSpacing: '-0.112px'
            }
        ]
    },
    spacing: {
        '22': '44px',
        '28': '56px',
        '31': '62px',
        '35': '70px',
        '40': '80px',
        '43': '86px',
        '48': '96px',
        '50': '100px',
        '52': '104px',
        '63': '126px',
        '97': '194px',
        '115': '230px',
        '195': '390px',
        '200': '400px',
        '207': '414px',
        '221': '442px',
        '1px': '1px',
        '77px': '77px',
        '111px': '111px',
        '147px': '147px',
        '163px': '163px',
        '211px': '211px',
        '255px': '255px',
        '315px': '315px',
        '381px': '381px'
    },
    borderRadius: {
        xs: '1px',
        sm: '4px',
        md: '10px',
        lg: '16px',
        xl: '20px',
        full: '999px'
    },
    boxShadow: {
        xs: 'rgba(1, 26, 53, 0.05) 0px 1px 2px 0px, rgba(1, 26, 53, 0.03) 0px 1px 1px 0px',
        sm: 'rgba(200, 164, 77, 0.6) 0px 0px 8px 0px',
        md: 'rgba(8, 32, 62, 0.7) 0px 4px 12px -10px',
        lg: 'rgba(132, 91, 0, 0.65) 0px 8px 18px -12px',
        xl: 'rgba(5, 29, 58, 0.62) 0px 10px 26px -24px',
        '2xl': 'rgba(0, 8, 22, 0.7) 0px 22px 50px -18px',
        '3xl': 'rgba(6, 13, 30, 0.6) 0px 32px 66px -30px, rgba(6, 13, 30, 0.08) 0px 4px 12px 0px',
        e8: 'rgba(3, 15, 34, 0.82) 0px 36px 90px -34px, rgba(3, 15, 34, 0.52) 0px 12px 34px -20px'
    },
    screens: {
        sm: '621px',
        '561px': '561px',
        md: '821px',
        '861px': '861px',
        '881px': '881px',
        '900px': '900px',
        '901px': '901px',
        lg: '1040px',
        '1100px': '1100px',
        '1101px': '1101px',
        '1401px': '1401px',
        '2xl': '1600px',
        '1680px': '1680px',
        '1700px': '1700px',
        '2400px': '2400px',
        '3000px': '3000px'
    },
    transitionDuration: {
        '0': '0s',
        '80': '0.08s',
        '100': '0.1s',
        '150': '0.15s',
        '160': '0.16s',
        '180': '0.18s',
        '200': '0.2s',
        '220': '0.22s',
        '240': '0.24s',
        '250': '0.25s',
        '260': '0.26s',
        '300': '0.3s',
        '360': '0.36s',
        '400': '0.4s',
        '500': '0.5s',
        '550': '0.55s',
        '700': '0.7s',
        '1800': '1.8s'
    },
    transitionTimingFunction: {
        custom: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        default: 'ease',
        linear: 'linear'
    },
    container: {
        center: true,
        padding: '0px'
    },
    maxWidth: {
        container: '100%'
    }
},
  },
};
