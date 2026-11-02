"use client";

import React, { createContext, useContext, useState } from 'react';
import { ScenarioType } from '@/types/dataCommand';

interface ScenarioContextProps { scenario: ScenarioType; setScenario: (s: ScenarioType) => void; }
const ScenarioContext = createContext<ScenarioContextProps>({ scenario: 'normal', setScenario: () => {} });

export const ScenarioProvider = ({ children }: { children: React.ReactNode }) => {
  const [scenario, setScenario] = useState<ScenarioType>('normal');
  return <ScenarioContext.Provider value={{ scenario, setScenario }}>{children}</ScenarioContext.Provider>;
};

export const useScenario = () => useContext(ScenarioContext);