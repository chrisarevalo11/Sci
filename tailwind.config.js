/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}'
	],
	prefix: '',
	theme: {
		extend: {
			fontFamily: {
				dela: ['Dela Gothic One', 'sans-serif']
			},
			gridTemplateColumns: {
				profile: '70% 30%'
			},
			colors: {
				customBlack: '#0C0C0C',
				customWhite: '#FCFCFC',
				customGreen: '#00D000',
				customGray: '#9E9E9E',
				transparentGray: '#44444444',
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				}
			},
			backgroundColor: {
				customBlack: '#0C0C0C',
				customWhite: '#FCFCFC',
				customGreen: '#00D000',
				customGray: '#9E9E9E',
				transparentGray: '#44444444'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'hero-image-sm': {
					'0%': {
						transform: 'translateY(500px)'
					},
					'100%': {
						transform: 'translateY(0px)'
					}
				},
				'hero-image': {
					'0%': {
						transform: 'translateX(60vw)'
					},
					'100%': {
						transform: 'translateX(0)'
					}
				},
				'hero-text-sm': {
					'0%': {
						transform: 'translateY(-500px)'
					},
					'100%': {
						transform: 'translateY(0)'
					}
				},
				'hero-text': {
					'0%': {
						transform: 'translateX(-60vw)'
					},
					'100%': {
						transform: 'translateX(0)'
					}
				},
				sponsors: {
					from: { transform: 'translateY(800px)' },
					to: { transform: 'translateY(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'hero-image-sm': 'hero-image-sm 0.8s ease-out',
				'hero-image': 'hero-image 0.8s ease-out',
				'hero-text-sm': 'hero-text-sm 0.8s ease-out',
				'hero-text': 'hero-text 0.8s ease-out',
				sponsors: 'sponsors 0.8s ease-out'
			}
		}
	},
	plugins: [require('tailwindcss-animate')]
}
