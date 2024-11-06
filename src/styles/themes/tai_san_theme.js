// File: src/styles/themes/tai_san_theme.js
// Link tham khảo: https://chakra-ui.com/docs/styled-system/customize-theme
// Nhánh: main

export const taiSanTheme = {
    colors: {
      brand: {
        50: '#E3F2FD',
        100: '#BBDEFB',
        200: '#90CAF9',
        300: '#64B5F6',
        400: '#42A5F5',
        500: '#2196F3',
        600: '#1E88E5',
        700: '#1976D2',
        800: '#1565C0',
        900: '#0D47A1'
      },
    },
    components: {
      Table: {
        baseStyle: {
            th: {
                color: 'whiteAlpha.600',
                borderColor: 'whiteAlpha.200',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontSize: 'xs',
                paddingTop: 4,
                paddingBottom: 4,
              },
              td: {
                borderColor: 'whiteAlpha.100',
                paddingTop: 4,
                paddingBottom: 4,
              },
              caption: {
                color: 'whiteAlpha.600',
              },
            },
            variants: {
              simple: {
                th: {
                  borderBottom: '1px solid',
                  borderColor: 'whiteAlpha.200',
                },
                td: {
                  borderBottom: '1px solid',
                  borderColor: 'whiteAlpha.100',
                },
              },
            },
          },
          Button: {
            baseStyle: {
              fontWeight: 'medium',
              borderRadius: 'md',
            },
            variants: {
              solid: {
                bg: 'brand.500',
                color: 'white',
                _hover: {
                  bg: 'brand.600',
                },
                _active: {
                  bg: 'brand.700',
                },
              },
              outline: {
                borderColor: 'whiteAlpha.200',
                color: 'whiteAlpha.900',
                _hover: {
                  bg: 'whiteAlpha.50',
                },
              },
              ghost: {
                color: 'whiteAlpha.900',
                _hover: {
                  bg: 'whiteAlpha.50',
                },
              },
            },
          },
          Input: {
            baseStyle: {
              field: {
                borderColor: 'whiteAlpha.200',
                _hover: {
                  borderColor: 'brand.500',
                },
                _focus: {
                  borderColor: 'brand.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                },
              },
            },
            variants: {
              filled: {
                field: {
                  bg: 'whiteAlpha.50',
                  _hover: {
                    bg: 'whiteAlpha.100',
                  },
                  _focus: {
                    bg: 'whiteAlpha.100',
                  },
                },
              },
            },
            defaultProps: {
              variant: 'filled',
            },
          },
          Select: {
            baseStyle: {
              field: {
                borderColor: 'whiteAlpha.200',
                _hover: {
                  borderColor: 'brand.500',
                },
                _focus: {
                  borderColor: 'brand.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                },
              },
            },
            variants: {
              filled: {
                field: {
                  bg: 'whiteAlpha.50',
                  _hover: {
                    bg: 'whiteAlpha.100',
                  },
                  _focus: {
                    bg: 'whiteAlpha.100',
                  },
                },
              },
            },
            defaultProps: {
              variant: 'filled',
            },
          },
          Menu: {
            baseStyle: {
              list: {
                bg: 'gray.800',
                borderColor: 'whiteAlpha.200',
                boxShadow: 'lg',
              },
              item: {
                bg: 'transparent',
                _hover: {
                  bg: 'whiteAlpha.100',
                },
                _focus: {
                  bg: 'whiteAlpha.100',
                },
              },
            },
          },
          Modal: {
            baseStyle: {
              dialog: {
                bg: 'gray.800',
                borderColor: 'whiteAlpha.200',
                boxShadow: 'lg',
              },
              header: {
                borderBottomColor: 'whiteAlpha.200',
              },
              footer: {
                borderTopColor: 'whiteAlpha.200',
              },
              body: {
                padding: 6,
              },
            },
          },
          Tabs: {
            variants: {
              'soft-rounded': {
                tab: {
                  color: 'whiteAlpha.600',
                  _selected: {
                    color: 'white',
                    bg: 'brand.500',
                  },
                  _hover: {
                    color: 'white',
                  },
                },
              },
            },
          },
        },
        styles: {
          global: {
            body: {
              bg: 'gray.900',
              color: 'whiteAlpha.900',
            },
          },
        },
      };