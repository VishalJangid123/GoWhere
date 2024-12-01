import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export interface Location {
  name: string;
  latitude: number;
  longitude: number;
  street: string;
  district: string;
  province: string;
}

export interface EventData {
  eventName: string;
  tags: string[];
  audienceType: string;
  category: string;
  notes: string;
  location: Location;
  date: string;
}

const EventContext = createContext<{
  eventData: EventData;
  updateEventData: (newData: Partial<EventData>) => void;
} | undefined>(undefined);



interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [eventData, setEventData] = useState<EventData>({
    eventName: '',  
    tags: [],     
    audienceType: 'anyone',   
    category: '',     
    notes: '',                 
    location: {
      name: '',
      latitude: 37.7749,       
      longitude: -122.4194,  
      street: '',
      district: '',
      province: ''   
    },
    date: '',        
  });

  useEffect(()=> {
    console.log("Updated")
    console.log(eventData)
  }, [eventData])

  const updateEventData = (newData: Partial<EventData>) => {
    setEventData(prevState => ({
      ...prevState,           
      ...newData,             
    }));
  };

  return (
    <EventContext.Provider value={{ eventData, updateEventData }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};
