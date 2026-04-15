/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Smartphone, 
  Zap, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  Wifi, 
  CreditCard,
  TrendingUp,
  ShieldCheck,
  Loader2,
  Lock,
  Share2,
  Search,
  Calculator,
  Gift,
  HelpCircle,
  ChevronDown,
  Info,
  Cloud,
  Database,
  Infinity,
  HardDrive
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Package {
  id: string;
  price: number;
  data: string;
  validity: string;
  category: "daily" | "weekly" | "monthly";
  popular?: boolean;
  description: string;
  benefits: string[];
}

const PACKAGES: Package[] = [
  // Daily
  { 
    id: "d1", price: 10, data: "500MB", validity: "24 Horas", category: "daily",
    description: "Ideal para check-ins rápidos e mensagens essenciais.",
    benefits: ["Navegação básica", "WhatsApp ilimitado", "Redes sociais leves"]
  },
  { 
    id: "d2", price: 20, data: "1.5GB", validity: "24 Horas", category: "daily",
    description: "Perfeito para um dia de uso moderado com streaming de música.",
    benefits: ["Streaming de música", "Navegação fluida", "Download de ficheiros pequenos"]
  },
  { 
    id: "d3", price: 50, data: "9GB", validity: "24 Horas", category: "daily", popular: true,
    description: "O rei dos diários. Streaming HD e downloads sem preocupações.",
    benefits: ["Streaming HD", "Gaming online", "Hotspot pessoal"]
  },
  
  // Weekly
  { 
    id: "w1", price: 100, data: "14GB", validity: "7 Dias", category: "weekly",
    description: "Equilíbrio perfeito para a sua semana de trabalho ou estudo.",
    benefits: ["Videochamadas", "Estudo online", "Atualizações de apps"]
  },
  { 
    id: "w2", price: 150, data: "18GB", validity: "7 Dias", category: "weekly",
    description: "Mais liberdade para a sua semana digital intensa.",
    benefits: ["Redes sociais ilimitadas", "Backup em nuvem", "Múltiplos dispositivos"]
  },
  { 
    id: "w3", price: 200, data: "25GB", validity: "7 Dias", category: "weekly", popular: true,
    description: "A escolha preferida para quem não quer ficar offline na semana.",
    benefits: ["Streaming 4K", "Downloads pesados", "Alta prioridade de rede"]
  },
  { 
    id: "w4", price: 300, data: "40GB", validity: "7 Dias", category: "weekly",
    description: "Potência total para uma semana sem limites.",
    benefits: ["Uso profissional", "Grandes downloads", "Conectividade máxima"]
  },
  
  // Monthly
  { 
    id: "m1", price: 500, data: "60GB", validity: "30 Dias", category: "monthly",
    description: "A base sólida para o seu mês de conectividade.",
    benefits: ["Trabalho remoto", "Entretenimento diário", "Segurança de dados"]
  },
  { 
    id: "m2", price: 750, data: "100GB", validity: "30 Dias", category: "monthly", popular: true,
    description: "O gigante mensal. Liberdade total para toda a família.",
    benefits: ["Smart Home", "Streaming em várias telas", "Uso intensivo"]
  },
  { 
    id: "m3", price: 1000, data: "150GB", validity: "30 Dias", category: "monthly",
    description: "Para utilizadores avançados que exigem o melhor.",
    benefits: ["Criação de conteúdo", "Uploads rápidos", "Suporte prioritário"]
  },
  { 
    id: "m4", price: 1500, data: "250GB", validity: "30 Dias", category: "monthly",
    description: "O limite é a sua imaginação. Potência empresarial.",
    benefits: ["Servidores", "Backup total", "Conectividade redundante"]
  },
  { 
    id: "m5", price: 2000, data: "Unlimited", validity: "30 Dias", category: "monthly",
    description: "A experiência definitiva. Navegue sem olhar para o saldo.",
    benefits: ["Dados verdadeiramente ilimitados", "Sem redução de velocidade", "Acesso VIP"]
  },
];

const MERCHANT_NUMBER = "875376446";

const Logo = ({ className = "w-10 h-10", iconClassName = "w-6 h-6" }) => (
  <div className={`${className} bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 relative overflow-hidden group`}>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent)]" />
    <motion.div
      animate={{ 
        scale: [1, 1.1, 1],
        rotate: [0, 5, 0]
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity,
        ease: "easeInOut" 
      }}
    >
      <Zap className={`${iconClassName} text-white fill-white/20 relative z-10`} />
    </motion.div>
    <div className="absolute -right-1 -top-1 w-4 h-4 bg-white/10 rounded-full blur-sm" />
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [friendNumber, setFriendNumber] = useState("");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const filteredPackages = PACKAGES.filter(p => {
    const matchesTab = activeTab === "all" || p.category === activeTab;
    const matchesSearch = p.data.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.price.toString().includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  const handleActivate = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsPaymentModalOpen(true);
  };

  const handleShowDetails = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsDetailsModalOpen(true);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.match(/^(87|86|84|85)\d{7}$/)) {
      toast.error("Por favor, insira um número e-mola válido (ex: 87xxxxxxx)");
      return;
    }

    if (isGift && !friendNumber.match(/^(87|86|84|85)\d{7}$/)) {
      toast.error("Por favor, insira um número de destino válido para o seu amigo.");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulating e-mola STK Push
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success("Pedido enviado!", {
        description: `Verifique o telemóvel ${phoneNumber} para introduzir o PIN e-mola.`,
        duration: 5000,
      });

      // Simulate waiting for PIN entry and network confirmation
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      if (isGift) {
        toast.success("Presente enviado com sucesso! 🎁", {
          description: `O pacote de ${selectedPackage?.data} foi ativado para o número ${friendNumber}.`,
        });
      } else {
        toast.success("Pacote ativado com sucesso!", {
          description: `Você recebeu ${selectedPackage?.data}. Navegue à vontade!`,
        });
      }
      
      setIsPaymentModalOpen(false);
      setPhoneNumber("");
      setFriendNumber("");
      setIsGift(false);
    } catch (error) {
      toast.error("Erro ao processar o pagamento. Verifique o seu saldo e tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = async (pkg: Package) => {
    const shareText = `Olha esta oferta na TurboData! 🚀\nPacote de ${pkg.data} por apenas ${pkg.price} MT (${pkg.validity}).\nAtiva agora em: ${window.location.href}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TurboData Ofertas',
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        toast.success("Link copiado!", {
          description: "Os detalhes da oferta foram copiados para a sua área de transferência.",
        });
      } catch (err) {
        toast.error("Erro ao copiar link.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 leading-none mb-1">Movitel</span>
              <h1 className="text-3xl font-extrabold tracking-tighter bento-gradient-text leading-none">
                TurboData Ofertas
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-4 mr-4">
              <Button 
                variant="ghost" 
                className="text-muted-foreground hover:text-primary gap-2"
                onClick={() => setIsCalculatorOpen(true)}
              >
                <Calculator className="w-4 h-4" />
                Calculadora
              </Button>
            </div>
            <div className="hidden md:flex items-center gap-6 bg-card px-6 py-3 rounded-xl border border-border shadow-sm">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Saldo Atual</span>
                <span className="text-lg font-bold text-primary">1,240 MT</span>
              </div>
              <div className="h-8 w-[1px] bg-border" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Dados Restantes</span>
                <span className="text-lg font-bold text-primary">4.2 GB</span>
              </div>
            </div>
            <Button variant="outline" size="icon" className="rounded-full md:hidden">
              <Smartphone className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 max-w-7xl">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Procurar pacotes (ex: 9GB, 200MT)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 bg-card border-border rounded-2xl focus:ring-primary text-lg"
            />
          </div>
          
          <Button 
            variant="outline" 
            className="w-full md:w-auto h-14 px-6 rounded-2xl border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 text-primary font-bold gap-2"
            onClick={() => setIsCalculatorOpen(true)}
          >
            <Calculator className="w-5 h-5" />
            Quanto preciso?
          </Button>
        </div>

        {/* Offers Tabs */}
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
            <TabsList className="bg-card p-1 rounded-xl border border-border h-12">
              <TabsTrigger value="all" className="rounded-lg px-8 data-[state=active]:bg-secondary data-[state=active]:text-foreground">Todos</TabsTrigger>
              <TabsTrigger value="daily" className="rounded-lg px-8 data-[state=active]:bg-secondary data-[state=active]:text-foreground">Diário</TabsTrigger>
              <TabsTrigger value="weekly" className="rounded-lg px-8 data-[state=active]:bg-secondary data-[state=active]:text-foreground">Semanal</TabsTrigger>
              <TabsTrigger value="monthly" className="rounded-lg px-8 data-[state=active]:bg-secondary data-[state=active]:text-foreground">Mensal</TabsTrigger>
            </TabsList>
            <div className="text-sm text-muted-foreground font-medium bg-card px-4 py-2 rounded-full border border-border">
              Mostrando {filteredPackages.length} ofertas exclusivas
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[240px]">
            <AnimatePresence mode="popLayout">
              {filteredPackages.map((pkg, index) => {
                const isFeatured = pkg.popular || index === 0 || index === 5;
                const isTall = index === 2 || index === 7;
                
                return (
                  <motion.div
                    key={pkg.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`${isFeatured ? 'lg:col-span-2' : ''} ${isTall ? 'lg:row-span-2' : ''}`}
                  >
                    <Card 
                      onClick={() => handleShowDetails(pkg)}
                      className={`h-full relative overflow-hidden border border-border transition-all hover:border-primary/50 group flex flex-col justify-between p-6 rounded-[20px] cursor-pointer ${isFeatured ? 'bento-card-featured border-primary/30 shadow-lg shadow-primary/5' : 'bg-card'}`}
                    >
                      {pkg.popular && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-primary text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                            Mais Popular
                          </Badge>
                        </div>
                      )}
                      
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-4 block">
                          {pkg.category === 'daily' ? 'Pacote Diário' : pkg.category === 'weekly' ? 'Pacote Semanal' : 'Pacote Mensal'}
                        </span>
                        
                        <div className="flex items-center gap-3 mb-1">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            {pkg.data.includes('MB') ? (
                              <Cloud className="w-5 h-5" />
                            ) : pkg.data === 'Unlimited' ? (
                              <Infinity className="w-6 h-6" />
                            ) : (
                              <Database className="w-5 h-5" />
                            )}
                          </div>
                          <div className="flex items-baseline gap-1">
                            <h3 className="text-4xl font-extrabold tracking-tighter text-foreground">
                              {pkg.data === 'Unlimited' ? '∞' : pkg.data.replace(/[A-Z]/g, '')}
                            </h3>
                            <span className="text-xl font-bold text-muted-foreground">
                              {pkg.data === 'Unlimited' ? '' : pkg.data.match(/[A-Z]+/g)?.[0]}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-xl font-semibold text-foreground/90">
                          {pkg.price} MT
                        </p>
                        
                        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>Válido por {pkg.validity}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-6" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          onClick={() => handleActivate(pkg)}
                          className={`flex-grow h-11 rounded-xl font-bold text-sm transition-all ${isFeatured ? 'bg-white text-black hover:bg-white/90' : 'bg-primary text-white hover:bg-primary/90'}`}
                        >
                          {isFeatured ? 'Ativar Agora' : 'Ativar'}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleShare(pkg)}
                          className="h-11 w-11 rounded-xl border-border bg-card hover:bg-secondary transition-colors shrink-0"
                          title="Partilhar oferta"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </Tabs>

        {/* Details Modal */}
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="sm:max-w-[500px] bg-card border-border rounded-[24px]">
            <DialogHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                {selectedPackage?.data.includes('MB') ? (
                  <Cloud className="w-8 h-8" />
                ) : selectedPackage?.data === 'Unlimited' ? (
                  <Infinity className="w-10 h-10" />
                ) : (
                  <Database className="w-8 h-8" />
                )}
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold tracking-tight">Detalhes do Pacote</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Conheça melhor a sua oferta de <span className="text-foreground font-bold">{selectedPackage?.data}</span>
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="bg-secondary/20 p-4 rounded-xl border border-border">
                <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-2">Descrição</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedPackage?.description}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Vantagens Incluídas</h4>
                <div className="grid grid-cols-1 gap-2">
                  {selectedPackage?.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3 bg-card border border-border p-3 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      <span className="text-sm font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">Preço Total</span>
                  <span className="text-2xl font-black text-primary">{selectedPackage?.price} MT</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">Validade</span>
                  <span className="text-sm font-bold">{selectedPackage?.validity}</span>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="w-full sm:flex-1 h-12 rounded-xl font-bold"
                onClick={() => setIsDetailsModalOpen(false)}
              >
                Fechar
              </Button>
              <Button 
                className="w-full sm:flex-1 h-12 rounded-xl font-bold"
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  if (selectedPackage) handleActivate(selectedPackage);
                }}
              >
                Ativar Agora
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Payment Modal */}
        <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
          <DialogContent className="sm:max-w-[425px] bg-card border-border rounded-[24px]">
            <DialogHeader className="flex flex-row items-center gap-4 space-y-0">
              <Logo className="w-14 h-14" iconClassName="w-8 h-8" />
              <div>
                <DialogTitle className="text-2xl font-bold tracking-tight">Pagamento Seguro</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Ative o pacote de <span className="text-foreground font-bold">{selectedPackage?.data}</span>
                </DialogDescription>
              </div>
            </DialogHeader>
            
            <form onSubmit={handlePayment} className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold">Seu Número e-mola</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="87xxxxxxx"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-10 h-12 bg-background border-border rounded-xl focus:ring-primary"
                      disabled={isProcessing}
                      maxLength={9}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 bg-secondary/30 p-3 rounded-xl border border-border">
                  <input 
                    type="checkbox" 
                    id="gift" 
                    checked={isGift}
                    onChange={(e) => setIsGift(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <Label htmlFor="gift" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                    <Gift className="w-4 h-4 text-primary" />
                    Comprar para um amigo
                  </Label>
                </div>

                {isGift && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    <Label htmlFor="friend" className="text-sm font-semibold">Número do Amigo</Label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                      <Input
                        id="friend"
                        placeholder="Número do destinatário"
                        value={friendNumber}
                        onChange={(e) => setFriendNumber(e.target.value)}
                        className="pl-10 h-12 bg-background border-primary/20 rounded-xl focus:ring-primary"
                        disabled={isProcessing}
                        maxLength={9}
                      />
                    </div>
                  </motion.div>
                )}
                
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Pagamento processado via e-mola (Movitel)
                </p>
              </div>

              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Ao clicar em pagar, você receberá um pedido de confirmação no seu telemóvel. 
                  Basta introduzir o seu <span className="text-primary font-bold">PIN</span> para concluir.
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl font-bold text-lg relative overflow-hidden transition-all"
                disabled={isProcessing || !phoneNumber}
              >
                <AnimatePresence mode="wait">
                  {isProcessing ? (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center justify-center"
                    >
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span>Processando...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center justify-center"
                    >
                      Pagar {selectedPackage?.price} MT
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Calculator Modal */}
        <Dialog open={isCalculatorOpen} onOpenChange={setIsCalculatorOpen}>
          <DialogContent className="sm:max-w-[500px] bg-card border-border rounded-[24px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Calculator className="w-6 h-6 text-primary" />
                Calculadora de Dados
              </DialogTitle>
              <DialogDescription>
                Descubra qual o pacote ideal para o seu consumo.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {[
                { label: "Vídeos (YouTube/Netflix)", icon: "🎬", options: ["Pouco", "Moderado", "Muito"] },
                { label: "Redes Sociais", icon: "📱", options: ["Pouco", "Moderado", "Muito"] },
                { label: "Trabalho/Estudo", icon: "📚", options: ["Pouco", "Moderado", "Muito"] },
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between text-sm font-bold">
                    <span>{item.icon} {item.label}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {item.options.map(opt => (
                      <Button key={opt} variant="outline" className="text-xs h-9 rounded-lg border-border hover:border-primary">
                        {opt}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="bg-primary/10 p-4 rounded-xl border border-primary/20 text-center">
                <p className="text-xs text-muted-foreground mb-1">Recomendação TurboData</p>
                <p className="text-lg font-black text-primary">Pacote Semanal 25GB</p>
              </div>
            </div>
            <DialogFooter>
              <Button className="w-full h-12 rounded-xl font-bold" onClick={() => setIsCalculatorOpen(false)}>
                Ver Ofertas Recomendadas
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* FAQ Section */}
        <section className="mt-32 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-black mb-4">Perguntas Frequentes</h3>
            <p className="text-muted-foreground">Tudo o que precisa de saber sobre a TurboData.</p>
          </div>
          <div className="space-y-4">
            {[
              { q: "Como ativo um pacote?", a: "Escolha a oferta, insira o seu número e-mola e confirme com o seu PIN no telemóvel." },
              { q: "Posso comprar para outra pessoa?", a: "Sim! Use a opção 'Comprar para um amigo' no momento do pagamento." },
              { q: "Quanto tempo demora a ativação?", a: "A ativação é instantânea assim que o pagamento for confirmado via e-mola." },
              { q: "O que acontece se o pagamento falhar?", a: "Verifique se tem saldo suficiente no e-mola ou se introduziu o PIN correto." },
            ].map((item, i) => (
              <div key={i} className="bg-card border border-border p-6 rounded-2xl group cursor-pointer hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    {item.q}
                  </h4>
                  <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed hidden group-hover:block animate-in fade-in slide-in-from-top-2">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features / Trust Section */}
        <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Wifi, label: "Rede Ultra-Rápida", desc: "Conectividade 5G em todo o país" },
            { icon: ShieldCheck, label: "Segurança Total", desc: "Seus dados e créditos protegidos" },
            { icon: TrendingUp, label: "Melhor Custo-Benefício", desc: "Mais megabytes por cada metical" },
          ].map((feature, i) => (
            <div key={i} className="bg-card/50 p-8 rounded-[24px] border border-border/50 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-2xl mb-4">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-bold text-lg mb-2">{feature.label}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-16 mt-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div className="brand-section text-center md:text-left flex flex-col items-center md:items-start">
              <Logo className="w-12 h-12 mb-4" iconClassName="w-7 h-7" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-1">Movitel</span>
              <h2 className="text-2xl font-black bento-gradient-text">TurboData</h2>
              <p className="text-muted-foreground text-sm mt-2">A revolução dos dados em Moçambique.</p>
            </div>
            <div className="flex items-center gap-8">
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Termos</a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Privacidade</a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Suporte</a>
            </div>
          </div>
          <div className="pt-8 border-t border-border/50 text-center text-xs text-muted-foreground font-medium tracking-widest uppercase">
            © 2026 TurboData • Powered by MegaOfertas MT
          </div>
        </div>
      </footer>
    </div>
  );
}
