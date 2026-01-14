import { DEFAULT_BURGER_NAME, BURGER_NAME_PREFIX_HAMBURGUESA, BURGER_NAME_PREFIX_BURGER } from '../constants/defaults.constants';

export interface ParsedBurgerName {
  burgerPart: string;
  restPart: string;
}

export const parseBurgerName = (name: string): ParsedBurgerName => {
  const trimmedName = name.trim();
  const lowerName = trimmedName.toLowerCase();
  
  let burgerPart = 'BURGER';
  let restPart = '';
  
  const startsWithHamburguesa = lowerName.startsWith(BURGER_NAME_PREFIX_HAMBURGUESA);
  const startsWithBurger = lowerName.startsWith(BURGER_NAME_PREFIX_BURGER);
  
  if (startsWithHamburguesa) {
    restPart = trimmedName.substring(BURGER_NAME_PREFIX_HAMBURGUESA.length).trim();
  } else if (startsWithBurger) {
    restPart = trimmedName.substring(BURGER_NAME_PREFIX_BURGER.length).trim();
  } else {
    restPart = trimmedName;
  }
  
  const hasRestPart = restPart !== '';
  
  return { 
    burgerPart, 
    restPart: hasRestPart ? restPart : DEFAULT_BURGER_NAME
  };
};

