import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
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
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'logo-slam-in': {
  				'0%': {
  					opacity: '1',
  					transform: 'translateY(-300%) rotate(-180deg) scale(0.2)'
  				},
  				'50%': {
  					opacity: '1',
  					transform: 'translateY(0) rotate(0deg) scale(1.2)'
  				},
  				'70%': {
  					transform: 'translateY(-10%) scale(0.95)'
  				},
  				'100%': {
  					transform: 'translateY(0) scale(1)'
  				}
  			},
  			'logo-vibrate': {
  				'0%, 100%': {
  					transform: 'translateY(0) rotate(0deg) scale(1)'
  				},
  				'25%': {
  					transform: 'translateY(-5px) rotate(2deg) scale(1.01)'
  				},
  				'50%': {
  					transform: 'translateY(5px) rotate(-2deg) scale(0.99)'
  				},
  				'75%': {
  					transform: 'translateY(-5px) rotate(2deg) scale(1.01)'
  				}
  			},
  			'logo-burst-out': {
  				'0%': {
  					opacity: '1',
  					transform: 'scale(1) rotate(0deg)'
  				},
  				'100%': {
  					opacity: '0',
  					transform: 'scale(2) rotate(360deg)'
  				}
  			},
  			'bg-element-burst': {
  				'0%': {
  					opacity: '0',
  					transform: 'scale(0) rotate(0deg)'
  				},
  				'50%': {
  					opacity: '1',
  					transform: 'scale(1) rotate(180deg)'
  				},
  				'100%': {
  					opacity: '0',
  					transform: 'scale(1.5) rotate(360deg)'
  				}
  			},
  			'bg-element-float': {
  				'0%, 100%': {
  					transform: 'translate(0, 0) rotate(0deg)'
  				},
  				'25%': {
  					transform: 'translate(10px, -15px) rotate(5deg)'
  				},
  				'50%': {
  					transform: 'translate(-10px, 15px) rotate(-5deg)'
  				},
  				'75%': {
  					transform: 'translate(10px, -15px) rotate(5deg)'
  				}
  			},
  			'bg-fade-out-slide': {
  				'0%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				},
  				'100%': {
  					opacity: '0',
  					transform: 'translateY(-100%)'
  				}
  			},
  			shockwave: {
  				'0%': {
  					transform: 'scale(0)',
  					opacity: '1',
  					'box-shadow': '0 0 0 0px rgba(255, 193, 7, 0.7)'
  				},
  				'100%': {
  					transform: 'scale(2)',
  					opacity: '0',
  					'box-shadow': '0 0 0 50px rgba(255, 193, 7, 0)'
  				}
  			},
  			'particle-spread': {
  				'0%': {
  					opacity: '1',
  					transform: 'scale(1) translateX(0) translateY(0)'
  				},
  				'100%': {
  					opacity: '0',
  					transform: 'scale(0.2) translateX(var(--tw-particle-end-x)) translateY(var(--tw-particle-end-y))'
  				}
  			},
  			'fade-in-modal': {
  				from: {
  					opacity: '0'
  				},
  				to: {
  					opacity: '1'
  				}
  			},
  			'scale-in-modal': {
  				from: {
  					opacity: '0',
  					transform: 'scale(0.9) translateY(20px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'scale(1) translateY(0)'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'intro-slam': 'logo-slam-in 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
  			'intro-vibrate': 'logo-vibrate 0.5s ease-in-out infinite',
  			'intro-burst': 'logo-burst-out 0.8s ease-in forwards',
  			'bg-burst-anim': 'bg-element-burst 1s ease-out forwards',
  			'bg-float-anim': 'bg-element-float 6s ease-in-out infinite alternate',
  			'bg-exit-anim': 'bg-fade-out-slide 0.7s ease-in forwards',
  			'shockwave-anim': 'shockwave 0.7s ease-out forwards',
  			'particle-burst-anim': 'particle-spread 0.8s ease-out forwards',
  			'fade-in-modal': 'fade-in-modal 0.3s ease-out',
  			'scale-in-modal': 'scale-in-modal 0.4s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
