"use client";

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation' // Importa useRouter
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion' // Add this import at the top
import { ToastProvider, Toast, ToastTitle, ToastDescription, ToastViewport } from "@/components/ui/toast"

const europeanCountries = [
  "Albania", "Andorra", "Austria", "Bielorrusia", "Bélgica", "Bosnia y Herzegovina", "Bulgaria", 
  "Croacia", "Chipre", "República Checa", "Dinamarca", "Estonia", "Finlandia", "Francia", 
  "Alemania", "Grecia", "Hungría", "Islandia", "Irlanda", "Italia", "Kosovo", "Letonia", 
  "Liechtenstein", "Lituania", "Luxemburgo", "Malta", "Moldavia", "Mónaco", "Montenegro", 
  "Países Bajos", "Macedonia del Norte", "Noruega", "Polonia", "Portugal", "Rumania", "Rusia", 
  "San Marino", "Serbia", "Eslovaquia", "Eslovenia", "España", "Suecia", "Suiza", "Ucrania", 
  "Reino Unido", "Ciudad del Vaticano"
];

// Add proper typing for the country data
interface CountryData {
  name: {
    common: string;
  };
}

export default function Component() {
  const router = useRouter(); // Inicializa el router
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    address: '',
    postcode: '',
    country: '',
    city: '',
    quantity: '1',
    language: 'ndoweye'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState({ title: '', description: '', variant: 'default' })
  const [canNavigate, setCanNavigate] = useState(false);
  const [countryNames, setCountryNames] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await axios.get('https://restcountries.com/v3.1/all');
      const countries = response.data;
      
      // Create a mapping of country codes to names
      const nameMapping = countries.reduce((acc: {[key: string]: string}, country: any) => {
        acc[country.cca2] = country.name.common;
        return acc;
      }, {});
      
      setCountryNames(nameMapping);
      setCountries(countries);
    };

    fetchCountries();
  }, []);

  const handleCountryChange = async (countryCode: string) => {
    setSelectedCountry(countryCode);
    // Explicitly type the array access
    setFormData(prev => ({ ...prev, country: countryNames[countryCode as keyof typeof countryNames] }));
    
    try {
      const response = await axios.get(
        `https://secure.geonames.org/searchJSON?` + 
        `country=${countryCode}` +
        `&featureClass=P` +
        `&maxRows=1000` +
        `&username=explorimentalist` +
        `&orderby=population` +
        `&cities=cities15000`
      );
      
      if (response.data && response.data.geonames) {
        setCities(response.data.geonames);
      } else {
        setCities([]);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
    }
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setFormData(prev => ({ ...prev, city }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))

    // Real-time email validation
    if (name === 'email') {
      if (value === '') {
        setEmailError(null)
      } else if (!validateEmail(value)) {
        setEmailError('Por favor, introduce un correo electrónico válido')
      } else {
        setEmailError(null)
      }
    }
  }

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(String(email).toLowerCase())
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setEmailError(null)

    if (!validateEmail(formData.email)) {
      setEmailError('Por favor, introduce un correo electrónico válido.')
      setIsLoading(false)
      return
    }

    try {
      const response = await axios.post('/api/proxy', formData)
      if (response.data.result === 'success') {
        setToastMessage({
          title: '¡Éxito!',
          description: 'Formulario enviado correctamente. Serás redirigido en unos segundos.',
          variant: 'success'
        })
        setShowToast(true)
        // Reset form but don't navigate yet
        setFormData({
          name: '',
          surname: '',
          email: '',
          address: '',
          postcode: '',
          country: '',
          city: '',
          quantity: '',
          language: ''
        })
        // Enable navigation after 10 seconds
        setTimeout(() => {
          setCanNavigate(true)
        }, 10000)
      } else {
        throw new Error('Hubo un error al enviar el formulario.')
      }
    } catch (error) {
      setToastMessage({
        title: 'Error',
        description: 'Hubo un error al enviar el formulario. Por favor, inténtelo de nuevo.',
        variant: 'destructive'
      })
      setShowToast(true)
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: '',
      surname: '',
      email: '',
      address: '',
      postcode: '',
      country: '',
      city: '',
      quantity: '',
      language: ''
    });
    router.push('/');
  }

  // Add useEffect to handle navigation
  useEffect(() => {
    if (canNavigate) {
      router.push('/');
    }
  }, [canNavigate, router]);

  return (
    <ToastProvider duration={10000}>
      <form onSubmit={handleSubmit} className="space-y-8 max-w-xl mx-auto p-6 bg-white rounded-lg shadow mt-6 mb-6">
        <h2 className="text-3xl font-bold text-center mb-6 text-black">Pedido de Elanji Minyya</h2>
        
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-black">Detalles del Pedido</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-black">Cantidad de Calendarios</Label>
              <Input 
                id="quantity" 
                name="quantity" 
                type="number" 
                min="1" 
                value={formData.quantity} 
                onChange={handleChange} 
                required 
                className="border-gray-300 text-black hover:border-gray-400 focus:border-black transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language" className="text-black">Variante Lingüística</Label>
              <Select 
                name="language" 
                defaultValue="ndoweye"
                onValueChange={(value) => handleChange({ target: { name: 'language', value } })}
              >
                <SelectTrigger className="border-gray-300 text-black hover:border-gray-400 focus:border-black transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baseki">En Basèki (Eyanghi-Màÿÿu)</SelectItem>
                  <SelectItem value="ndoweye">En variantes Ndowéÿé (Elanji-Minyya)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-black">Información Personal</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-black">Nombre</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className="border-gray-300 text-black hover:border-gray-400 focus:border-black transition-colors" 
                placeholder="Introduce tu nombre"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="surname" className="text-black">Apellido</Label>
              <Input 
                id="surname" 
                name="surname" 
                value={formData.surname} 
                onChange={handleChange} 
                required 
                className="border-gray-300 text-black hover:border-gray-400 focus:border-black transition-colors" 
                placeholder="Introduce tu apellido"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-black">Correo Electrónico</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                className={`border-gray-300 text-black ${emailError ? 'border-red-500' : ''}`} 
                placeholder="ejemplo@correo.com"
              />
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-black">Dirección de Envío</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="country" className="text-black">País</Label>
              <Select name="country" onValueChange={handleCountryChange}>
                <SelectTrigger className="border-gray-300 text-black hover:border-gray-400 focus:border-black transition-colors">
                  <SelectValue placeholder="Selecciona un país" />
                </SelectTrigger>
                <SelectContent position="popper" className="max-h-[200px] overflow-y-auto">
                  {Object.entries(countryNames)
                    .sort(([, a], [, b]) => a.localeCompare(b))
                    .map(([code, name]) => (
                      <SelectItem key={code} value={code}>
                        {name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <AnimatePresence>
              {selectedCountry && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                  <Label htmlFor="city" className="text-black">Ciudad</Label>
                  <Select name="city" onValueChange={handleCityChange}>
                    <SelectTrigger className="border-gray-300 text-black hover:border-gray-400 focus:border-black transition-colors">
                      <SelectValue placeholder="Selecciona una ciudad" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="max-h-[200px] overflow-y-auto">
                      {cities.sort((a, b) => a.name.localeCompare(b.name)).map((city) => (
                        <SelectItem key={city.geonameId} value={city.name}>{city.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label htmlFor="postcode" className="text-black">Código Postal</Label>
              <Input 
                id="postcode" 
                name="postcode" 
                value={formData.postcode} 
                onChange={handleChange} 
                required 
                className="border-gray-300 text-black hover:border-gray-400 focus:border-black transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-black">Dirección</Label>
              <Input 
                id="address" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                required 
                className="border-gray-300 text-black hover:border-gray-400 focus:border-black transition-colors" 
              />
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4 pt-4">
          <Button type="button" onClick={handleCancel} variant="outline" className="flex-1 border-gray-300 text-black">Cancelar</Button>
          <Button type="submit" disabled={isLoading} className="flex-1 bg-black text-white">
            {isLoading ? 'Enviando...' : 'Enviar Pedido'}
          </Button>
        </div>
        {error && <div className="text-red-500">{error}</div>}
      </form>
      
      {showToast && (
        <Toast
          variant={toastMessage.variant as 'default' | 'success' | 'destructive'}
          onOpenChange={(open) => {
            if (!open) {
              setShowToast(false)
              // If it's a success toast and it's being closed, trigger navigation
              if (toastMessage.variant === 'success') {
                setCanNavigate(true)
              }
            }
          }}
        >
          <div className="flex flex-col gap-1">
            <ToastTitle>{toastMessage.title}</ToastTitle>
            <ToastDescription>{toastMessage.description}</ToastDescription>
            {toastMessage.variant === 'success' && (
              <Button 
                onClick={() => setCanNavigate(true)} 
                className="mt-2 w-full"
                variant="outline"
              >
                Ir al calendario
              </Button>
            )}
          </div>
        </Toast>
      )}
      <ToastViewport />
    </ToastProvider>
  )
}