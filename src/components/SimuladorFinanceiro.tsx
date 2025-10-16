import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

interface FormData {
  valorBem: string;
  prazoMeses: string;
  taxaBanco: string;
  iof: string;
  despesasExtras: string;
}

const SimuladorFinanceiro = () => {
  const [formData, setFormData] = useState<FormData>({
    valorBem: "50000000",
    prazoMeses: "60",
    taxaBanco: "2.5",
    iof: "0",
    despesasExtras: "0",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    // Remove caracteres não numéricos exceto ponto e vírgula
    const cleanValue = value.replace(/[^\d.,]/g, "");
    setFormData((prev) => ({
      ...prev,
      [field]: cleanValue,
    }));
  };

  const parseNumber = (value: string): number => {
    if (!value || value === "") return 0;
    // Substitui vírgula por ponto e converte para número
    return parseFloat(value.replace(",", ".")) || 0;
  };

  const calcularPMT = (taxa: number, nper: number, vp: number): number => {
    if (taxa === 0) return vp / nper;
    const taxaDecimal = taxa / 100;
    return (vp * taxaDecimal * Math.pow(1 + taxaDecimal, nper)) / (Math.pow(1 + taxaDecimal, nper) - 1);
  };

  // Cálculos
  const valorBem = parseNumber(formData.valorBem);
  const prazoMeses = parseNumber(formData.prazoMeses);
  const taxaBanco = parseNumber(formData.taxaBanco);
  const iof = parseNumber(formData.iof);
  const despesasExtras = parseNumber(formData.despesasExtras);

  const valorOperacao = valorBem + despesasExtras;
  const valorReciboAluguel = prazoMeses > 0 ? calcularPMT(taxaBanco, prazoMeses, valorOperacao) : 0;
  const creditosPisCofins = valorReciboAluguel * 0.0925; // 9.25%
  const valorLiquidoAluguelPisCofins = valorReciboAluguel - creditosPisCofins;
  const reducaoIR = valorLiquidoAluguelPisCofins * 0.34; // 34%
  const valorLiquidoAluguel = valorLiquidoAluguelPisCofins - reducaoIR;
  const investimentoLiquidoTotal = valorLiquidoAluguel * prazoMeses;

  const formatarMoeda = (valor: number): string => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatarPercentual = (valor: number): string => {
    return valor.toLocaleString("pt-BR", {
      minimumFractionDigits: 5,
      maximumFractionDigits: 5,
    }) + "%";
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Simulador Financeiro</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Avaliação de Projetos - Equipamentos
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Card de Entrada */}
          <Card className="shadow-lg">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-2xl">Dados da Operação</CardTitle>
              <CardDescription>Insira os valores para calcular</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="valorBem" className="text-base font-semibold">
                  Valor do bem
                </Label>
                <Input
                  id="valorBem"
                  type="text"
                  value={formData.valorBem}
                  onChange={(e) => handleInputChange("valorBem", e.target.value)}
                  className="text-lg"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prazoMeses" className="text-base font-semibold">
                  Prazo em meses
                </Label>
                <Input
                  id="prazoMeses"
                  type="text"
                  value={formData.prazoMeses}
                  onChange={(e) => handleInputChange("prazoMeses", e.target.value)}
                  className="text-lg"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxaBanco" className="text-base font-semibold">
                  Taxa banco (%)
                </Label>
                <Input
                  id="taxaBanco"
                  type="text"
                  value={formData.taxaBanco}
                  onChange={(e) => handleInputChange("taxaBanco", e.target.value)}
                  className="text-lg"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="iof" className="text-base font-semibold">
                  IOF (%)
                </Label>
                <Input
                  id="iof"
                  type="text"
                  value={formData.iof}
                  onChange={(e) => handleInputChange("iof", e.target.value)}
                  className="text-lg"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="despesasExtras" className="text-base font-semibold">
                  Despesas extras
                </Label>
                <Input
                  id="despesasExtras"
                  type="text"
                  value={formData.despesasExtras}
                  onChange={(e) => handleInputChange("despesasExtras", e.target.value)}
                  className="text-lg"
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>

          {/* Card de Resultados */}
          <Card className="shadow-lg">
            <CardHeader className="bg-secondary/10">
              <CardTitle className="text-2xl">Resultados</CardTitle>
              <CardDescription>Valores calculados automaticamente</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="font-semibold">Valor da operação:</span>
                <span className="font-bold text-primary">{formatarMoeda(valorOperacao)}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="font-semibold">Prazo:</span>
                <span className="font-bold">{prazoMeses} meses</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="font-semibold">Valor recibo de aluguel:</span>
                <span className="font-bold text-primary">{formatarMoeda(valorReciboAluguel)}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="font-semibold">Créditos Pis e Cofins:</span>
                <span className="font-bold text-secondary">{formatarMoeda(creditosPisCofins)}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="font-semibold">Vlr liq alug Pis Cofins rec:</span>
                <span className="font-bold">{formatarMoeda(valorLiquidoAluguelPisCofins)}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="font-semibold">Redução do I.R.:</span>
                <span className="font-bold text-secondary">{formatarMoeda(reducaoIR)}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="font-semibold">Valor líquido do aluguel:</span>
                <span className="font-bold text-accent">{formatarMoeda(valorLiquidoAluguel)}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg border-2 border-primary mt-6">
                <span className="font-bold text-lg">Investimento Líquido Total:</span>
                <span className="font-bold text-xl text-primary">{formatarMoeda(investimentoLiquidoTotal)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 shadow-lg">
          <CardContent className="pt-6">
            <p className="text-center text-sm text-muted-foreground">
              Este cálculo utiliza valores e taxas de mercado apenas como referência, sem validade para propostas comerciais.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimuladorFinanceiro;
