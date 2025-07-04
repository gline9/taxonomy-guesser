import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const AppTheme = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{rose.50}',
            100: '{rose.100}',
            200: '{rose.200}',
            300: '{rose.300}',
            400: '{rose.400}',
            500: '{rose.500}',
            600: '{rose.600}',
            700: '{rose.700}',
            800: '{rose.800}',
            900: '{rose.900}',
            950: '{rose.950}'
        },
        surface: {
            50: '{soho.50}',
            100: '{soho.100}',
            200: '{soho.200}',
            300: '{soho.300}',
            400: '{soho.400}',
            500: '{soho.500}',
            600: '{soho.600}',
            700: '{soho.700}',
            800: '{soho.800}',
            900: '{soho.900}',
            950: '{soho.950}'
        }
    }
});
