"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, ArrowDown, Loader2, BarChart3, PieChart, LineChart, Calendar, GraduationCap, BookOpen, Building2, Clock, Users, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Datos simulados para gráficos
const utilizacionAulas = [
  { nombre: "Lunes", porcentaje: 85 },
  { nombre: "Martes", porcentaje: 92 },
  { nombre: "Miércoles", porcentaje: 89 },
  { nombre: "Jueves", porcentaje: 78 },
  { nombre: "Viernes", porcentaje: 67 },
];

// Tipos para los mensajes del chat
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const DashboardPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy tu asistente para consultas de horarios académicos. ¿En qué puedo ayudarte hoy?',
      timestamp: 'Ahora'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Para gestionar las marcas de tiempo una vez que el componente está montado
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === '1') {
      setMessages([{
        ...messages[0],
        timestamp: formatTimestamp(new Date())
      }]);
    }
  }, []);

  // Función para formatear marcas de tiempo de manera consistente
  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Función para manejar el envío de mensajes
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const messageId = Date.now().toString();
    const currentTime = formatTimestamp(new Date());
    
    const newUserMessage: ChatMessage = {
      id: messageId,
      role: 'user',
      content: inputMessage,
      timestamp: currentTime
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      setTimeout(() => {
        const botResponse: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: getSimulatedResponse(inputMessage),
          timestamp: formatTimestamp(new Date())
        };
        
        setMessages(prev => [...prev, botResponse]);
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error al procesar mensaje:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Lo siento, ha ocurrido un error al procesar tu consulta.',
        timestamp: formatTimestamp(new Date())
      }]);
      setIsLoading(false);
    }
  };

  // Función para simular respuestas de la IA
  const getSimulatedResponse = (message: string): string => {
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('horario') && lowerMsg.includes('matemática')) {
      return 'Los cursos de Matemáticas se imparten los lunes y miércoles de 9:00 a 11:00 en el Aula 305.';
    } else if (lowerMsg.includes('docente') || lowerMsg.includes('profesor')) {
      return 'Tenemos 48 docentes activos este periodo. ¿Te gustaría información sobre alguno en particular?';
    } else if (lowerMsg.includes('aula')) {
      return 'Contamos con 24 aulas disponibles, distribuidas en 3 edificios. Las aulas están equipadas con proyectores y aire acondicionado.';
    } else if (lowerMsg.includes('curso')) {
      return 'Hay 120 cursos activos este periodo académico. Los cursos más demandados son Programación, Cálculo y Estadística.';
    } else {
      return 'Entiendo tu consulta. Para darte información más precisa, por favor especifica si necesitas detalles sobre horarios de algún curso específico, docente, aula o sección.';
    }
  };

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Panel de Control</h1>
          <p className="text-muted-foreground">
            Bienvenido al Sistema de Gestión de Horarios 
            <span className="badge badge-primary badge-sm mx-1">Pontificia</span>
          </p>
        </div>
        
        <div className="hidden sm:flex items-center space-x-4">
          <div className="text-sm text-right">
            <div className="font-medium">Periodo Actual</div>
            <div className="text-muted-foreground">2023-II</div>
          </div>
          <Calendar className="text-primary w-5 h-5" />
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="analitica">Analítica</TabsTrigger>
          <TabsTrigger value="asistente">Asistente IA</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Tarjetas de estadísticas */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aulas</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500">+8.2%</span> desde el último periodo
                </p>
                <div className="mt-3">
                  <Progress value={75} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">75% de ocupación media</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Docentes</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">48</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500">+10.4%</span> desde el último periodo
                </p>
                <div className="mt-3">
                  <Progress value={82} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">82% con carga completa</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cursos</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">120</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500">+11.7%</span> desde el último periodo
                </p>
                <div className="mt-3">
                  <Progress value={90} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">90% programados</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Secciones</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">210</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500">+9.3%</span> desde el último periodo
                </p>
                <div className="mt-3">
                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">85% con horario asignado</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos y análisis */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Utilización de Aulas por Día</CardTitle>
                <CardDescription>Porcentaje de uso de aulas durante la semana</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[240px] w-full">
                  {/* Aquí iría un componente de gráfico de barras real - lo simulamos con divs */}
                  <div className="flex h-[200px] items-end gap-2 pl-6 pt-6">
                    {utilizacionAulas.map((dia, index) => (
                      <div key={index} className="relative flex w-full max-w-[68px] flex-col items-center">
                        <div 
                          className="w-full rounded-md bg-primary transition-all duration-300"
                          style={{height: `${dia.porcentaje * 1.6}px`}}
                        />
                        <span className="mt-1 text-xs font-medium">{dia.nombre.substring(0, 3)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Distribución de cursos por tipo */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Distribución de Cursos</CardTitle>
                <CardDescription>Por tipo de aula requerida</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[240px] flex items-center justify-center">
                  <div className="w-[160px] h-[160px] rounded-full border-8 relative flex items-center justify-center">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-primary rounded-r-full" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'}}></div>
                    <div className="absolute top-0 left-0 w-3/5 h-3/5 bg-secondary rounded-full"></div>
                    <div className="z-10 text-xs font-medium">3 tipos</div>
                  </div>
                  <div className="space-y-2 ml-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                      <div className="text-xs">Teóricos (65%)</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-secondary mr-2"></div>
                      <div className="text-xs">Laboratorios (25%)</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-muted mr-2"></div>
                      <div className="text-xs">Talleres (10%)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bloques de horario más usados */}
          <div className="grid gap-4 md:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Bloques de Horario Más Demandados</CardTitle>
                <CardDescription>Los 5 horarios con mayor ocupación</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Lunes 9:00 - 11:00</span>
                    </div>
                    <div className="w-1/3">
                      <Progress value={98} className="h-2" />
                    </div>
                    <span className="text-sm font-medium">98%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Martes 11:00 - 13:00</span>
                    </div>
                    <div className="w-1/3">
                      <Progress value={95} className="h-2" />
                    </div>
                    <span className="text-sm font-medium">95%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Miércoles 9:00 - 11:00</span>
                    </div>
                    <div className="w-1/3">
                      <Progress value={92} className="h-2" />
                    </div>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Jueves 15:00 - 17:00</span>
                    </div>
                    <div className="w-1/3">
                      <Progress value={88} className="h-2" />
                    </div>
                    <span className="text-sm font-medium">88%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Lunes 15:00 - 17:00</span>
                    </div>
                    <div className="w-1/3">
                      <Progress value={85} className="h-2" />
                    </div>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analitica" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Rendimiento</CardTitle>
              <CardDescription>Análisis de la eficiencia del sistema de horarios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Aquí podríamos agregar gráficos más detallados si tuviéramos una biblioteca */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Eficiencia en Asignación</p>
                    <p className="text-sm text-muted-foreground">Calidad de la distribución de recursos</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">92.5%</p>
                    <p className="text-xs text-emerald-500">+2.3%</p>
                  </div>
                </div>
                <Progress value={92.5} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Satisfacción de Restricciones</p>
                    <p className="text-sm text-muted-foreground">Cumplimiento de requisitos de cursos y docentes</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">88.7%</p>
                    <p className="text-xs text-emerald-500">+5.1%</p>
                  </div>
                </div>
                <Progress value={88.7} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Uso de Capacidad</p>
                    <p className="text-sm text-muted-foreground">Uso óptimo de la capacidad de las aulas</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">78.3%</p>
                    <p className="text-xs text-emerald-500">+1.5%</p>
                  </div>
                </div>
                <Progress value={78.3} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Distribución de Carga Docente</p>
                    <p className="text-sm text-muted-foreground">Equilibrio en la carga horaria de los profesores</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">85.2%</p>
                    <p className="text-xs text-emerald-500">+3.7%</p>
                  </div>
                </div>
                <Progress value={85.2} className="h-2" />
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Métricas calculadas basadas en los últimos datos del periodo académico 2023-II.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="asistente" className="grid grid-cols-1 gap-6">
          {/* Columna del chat en pestaña separada */}
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b px-4 py-3">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="/bot-avatar.png" />
                  <AvatarFallback className="bg-primary/10">
                    <Bot size={16} className="text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">Asistente de Horarios</CardTitle>
                  <CardDescription>Consulta información sobre el sistema</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`chat ${message.role === 'user' ? 'chat-end' : 'chat-start'}`}
                  >
                    <div className="chat-image avatar">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                        ${message.role === 'user' 
                          ? 'bg-primary/15 text-primary' 
                          : 'bg-neutral/15 text-neutral'}`}
                      >
                        {message.role === 'user' 
                          ? <User size={14} /> 
                          : <Bot size={14} />}
                      </div>
                    </div>
                    <div className={`chat-bubble ${
                      message.role === 'user' 
                        ? 'chat-bubble-primary text-primary-content' 
                        : 'chat-bubble-neutral text-neutral-content'
                    }`}>
                      {message.content}
                    </div>
                    <div className="chat-footer opacity-70 text-xs">
                      {message.timestamp}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="chat chat-start">
                    <div className="chat-image avatar">
                      <div className="w-8 h-8 rounded-full bg-neutral/15 text-neutral flex items-center justify-center">
                        <Bot size={14} />
                      </div>
                    </div>
                    <div className="chat-bubble chat-bubble-neutral flex items-center gap-2">
                      <Loader2 className="animate-spin h-4 w-4" />
                      <span>Escribiendo...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            <CardFooter className="border-t p-3">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex w-full gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Escribe tu consulta sobre horarios..."
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button 
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  variant="default"
                  size="sm"
                  className="h-10"
                >
                  <Send size={16} />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;