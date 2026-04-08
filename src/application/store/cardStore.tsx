import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';
import {
  createDefaultCardDocument,
  normalizeCardDocument,
  validateCardDocument,
  type CardDocument,
  type CardOrientation,
  type CardQrMode,
  type CardTemplate,
  type CardTheme,
  type CardValidationErrors,
} from '../../domain/card';
import { loadCardDocument, saveCardDocument } from '../../services/persistence';

type FrontField = keyof CardDocument['front'];
type BackField = keyof CardDocument['back'];

type CardAction =
  | { type: 'update-front-field'; field: FrontField; value: string }
  | { type: 'update-back-field'; field: BackField; value: string }
  | { type: 'set-template'; template: CardTemplate }
  | { type: 'set-theme'; theme: CardTheme }
  | { type: 'set-orientation'; orientation: CardOrientation }
  | { type: 'set-qr-mode'; qrMode: CardQrMode }
  | { type: 'hydrate'; document: CardDocument };

interface CardState {
  document: CardDocument;
  errors: CardValidationErrors;
}

interface CardStoreValue extends CardState {
  updateFrontField: (field: FrontField, value: string) => void;
  updateBackField: (field: BackField, value: string) => void;
  setTemplate: (template: CardTemplate) => void;
  setTheme: (theme: CardTheme) => void;
  setOrientation: (orientation: CardOrientation) => void;
  setQrMode: (qrMode: CardQrMode) => void;
}

const CardStoreContext = createContext<CardStoreValue | null>(null);

function withUpdatedMeta(document: CardDocument): CardDocument {
  return {
    ...document,
    meta: {
      ...document.meta,
      updatedAt: new Date().toISOString(),
    },
  };
}

function reduceDocument(document: CardDocument, action: CardAction): CardDocument {
  switch (action.type) {
    case 'hydrate':
      return action.document;
    case 'update-front-field':
      return withUpdatedMeta({
        ...document,
        front: {
          ...document.front,
          [action.field]: action.value,
        },
      });
    case 'update-back-field':
      return withUpdatedMeta({
        ...document,
        back: {
          ...document.back,
          [action.field]: action.value,
        },
      });
    case 'set-template':
      return withUpdatedMeta({
        ...document,
        style: {
          ...document.style,
          template: action.template,
        },
      });
    case 'set-theme':
      return withUpdatedMeta({
        ...document,
        style: {
          ...document.style,
          theme: action.theme,
        },
      });
    case 'set-orientation':
      return withUpdatedMeta({
        ...document,
        style: {
          ...document.style,
          orientation: action.orientation,
        },
      });
    case 'set-qr-mode':
      return withUpdatedMeta({
        ...document,
        back: {
          ...document.back,
          qrMode: action.qrMode,
        },
      });
    default:
      return document;
  }
}

function cardStateReducer(state: CardState, action: CardAction): CardState {
  const updatedDocument = normalizeCardDocument(reduceDocument(state.document, action));
  const errors = validateCardDocument(updatedDocument);

  saveCardDocument(updatedDocument);

  return {
    document: updatedDocument,
    errors,
  };
}

function getInitialState(): CardState {
  const loaded = loadCardDocument();
  const normalized = normalizeCardDocument(loaded ?? createDefaultCardDocument());
  return {
    document: normalized,
    errors: validateCardDocument(normalized),
  };
}

export function CardStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cardStateReducer, undefined, getInitialState);

  const value = useMemo<CardStoreValue>(
    () => ({
      ...state,
      updateFrontField: (field, value) => dispatch({ type: 'update-front-field', field, value }),
      updateBackField: (field, value) => dispatch({ type: 'update-back-field', field, value }),
      setTemplate: (template) => dispatch({ type: 'set-template', template }),
      setTheme: (theme) => dispatch({ type: 'set-theme', theme }),
      setOrientation: (orientation) => dispatch({ type: 'set-orientation', orientation }),
      setQrMode: (qrMode) => dispatch({ type: 'set-qr-mode', qrMode }),
    }),
    [state],
  );

  return <CardStoreContext.Provider value={value}>{children}</CardStoreContext.Provider>;
}

export function useCardStore(): CardStoreValue {
  const context = useContext(CardStoreContext);
  if (!context) {
    throw new Error('useCardStore must be used inside CardStoreProvider');
  }

  return context;
}
