'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calculator, 
  DollarSign, 
  Users, 
  MapPin, 
  TrendingUp,
  FileText,
  CreditCard,
  Briefcase,
  Clock,
  Gift,
  Info,
  Zap,
  Target,
  PieChart,
  Building,
  Calendar
} from 'lucide-react';
import { 
  calculateTaxes, 
  TaxInputs, 
  TaxResults, 
  STATE_TAX_INFO,
  FEDERAL_TAX_BRACKETS 
} from './taxCalculations';

export default function TaxCalculator() {
  const [inputs, setInputs] = useState<TaxInputs>({
    grossIncome: 85000,
    filingStatus: 'single',
    state: 'CA',
    age: 35,
    spouseAge: undefined,
    children: 1,
    itemizedDeductions: 5000,
    saltDeductions: 12000,
    businessIncome: 0,
    tips: 0,
    overtime: 0
  });

  const [results, setResults] = useState<TaxResults | null>(null);
  const [activeTab, setActiveTab] = useState('basic');

  // Real-time calculation on input change
  useEffect(() => {
    const calculatedResults = calculateTaxes(inputs);
    setResults(calculatedResults);
  }, [inputs]);

  const handleInputChange = (field: keyof TaxInputs, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' && field !== 'filingStatus' && field !== 'state' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (rate: number) => {
    return `${rate.toFixed(2)}%`;
  };

  const selectedState = STATE_TAX_INFO.find(s => s.code === inputs.state);
  const effectiveRateColor = results?.effectiveRate && results.effectiveRate > 25 ? 'text-red-600' : results?.effectiveRate && results.effectiveRate > 15 ? 'text-yellow-600' : 'text-green-600';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8 py-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Calculator className="h-12 w-12 text-blue-600" />
              <div className="absolute -top-1 -right-1 h-6 w-6 bg-gradient-to-r from-blue-500 to-blue-500 rounded-full flex items-center justify-center">
                <DollarSign className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="min-h-[120px] flex items-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-relaxed">
                WhatsMyName
              </h1>
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate your federal and state taxes accurately with real-time updates based on the July 8, 2025 tax legislation
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Zap className="h-3 w-3 mr-1" />
              Real-time Calculations
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Target className="h-3 w-3 mr-1" />
              All 50 States + DC
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Calendar className="h-3 w-3 mr-1" />
              2025 Tax Year
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Panel - Input Form */}
          <div className="lg:col-span-3">
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="h-6 w-6" />
                  Tax Information Input
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Enter your information to calculate taxes in real-time
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="basic" className="text-xs">
                      <Users className="h-4 w-4 mr-1" />
                      Basic Info
                    </TabsTrigger>
                    <TabsTrigger value="deductions" className="text-xs">
                      <FileText className="h-4 w-4 mr-1" />
                      Deductions
                    </TabsTrigger>
                    <TabsTrigger value="business" className="text-xs">
                      <Briefcase className="h-4 w-4 mr-1" />
                      Business
                    </TabsTrigger>
                    <TabsTrigger value="special" className="text-xs">
                      <Gift className="h-4 w-4 mr-1" />
                      Special
                    </TabsTrigger>
                  </TabsList>

                  {/* Basic Information Tab */}
                  <TabsContent value="basic" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="grossIncome" className="flex items-center gap-2 font-medium">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          Annual Gross Income
                        </Label>
                        <Input
                          id="grossIncome"
                          type="number"
                          placeholder="85000"
                          value={inputs.grossIncome || ''}
                          onChange={(e) => handleInputChange('grossIncome', e.target.value)}
                          className="text-lg font-semibold border-2 focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="filingStatus" className="flex items-center gap-2 font-medium">
                          <Users className="h-4 w-4 text-blue-600" />
                          Filing Status
                        </Label>
                        <Select 
                          value={inputs.filingStatus} 
                          onValueChange={(value) => handleInputChange('filingStatus', value)}
                        >
                          <SelectTrigger className="border-2 focus:border-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="marriedJoint">Married Filing Jointly</SelectItem>
                            <SelectItem value="marriedSeparate">Married Filing Separately</SelectItem>
                            <SelectItem value="headOfHousehold">Head of Household</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state" className="flex items-center gap-2 font-medium">
                          <MapPin className="h-4 w-4 text-red-600" />
                          State
                        </Label>
                        <Select 
                          value={inputs.state} 
                          onValueChange={(value) => handleInputChange('state', value)}
                        >
                          <SelectTrigger className="border-2 focus:border-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-64">
                            {STATE_TAX_INFO.map(state => (
                              <SelectItem key={state.code} value={state.code}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{state.name}</span>
                                  {!state.hasIncomeTax && (
                                    <Badge variant="outline" className="ml-2 text-xs">No Tax</Badge>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {selectedState && (
                          <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                            <Info className="h-3 w-3 inline mr-1" />
                            {selectedState.additionalInfo}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="age" className="font-medium">Your Age</Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="35"
                          value={inputs.age || ''}
                          onChange={(e) => handleInputChange('age', e.target.value)}
                          className="border-2 focus:border-blue-500"
                        />
                        {inputs.age >= 65 && (
                          <p className="text-xs text-green-600 bg-green-50 p-2 rounded">
                            ✨ Eligible for additional $4,000 senior deduction!
                          </p>
                        )}
                      </div>

                      {inputs.filingStatus === 'marriedJoint' && (
                        <div className="space-y-2">
                          <Label htmlFor="spouseAge" className="font-medium">Spouse Age</Label>
                          <Input
                            id="spouseAge"
                            type="number"
                            placeholder="33"
                            value={inputs.spouseAge || ''}
                            onChange={(e) => handleInputChange('spouseAge', e.target.value)}
                            className="border-2 focus:border-blue-500"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="children" className="flex items-center gap-2 font-medium">
                          <Gift className="h-4 w-4 text-pink-600" />
                          Number of Children
                        </Label>
                        <Input
                          id="children"
                          type="number"
                          placeholder="1"
                          value={inputs.children || ''}
                          onChange={(e) => handleInputChange('children', e.target.value)}
                          className="border-2 focus:border-blue-500"
                        />
                        <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                          💰 $2,200 Child Tax Credit per child (increased for 2025)
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Deductions Tab */}
                  <TabsContent value="deductions" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="itemizedDeductions" className="flex items-center gap-2 font-medium">
                          <FileText className="h-4 w-4 text-orange-600" />
                          Itemized Deductions
                        </Label>
                        <Input
                          id="itemizedDeductions"
                          type="number"
                          placeholder="5000"
                          value={inputs.itemizedDeductions || ''}
                          onChange={(e) => handleInputChange('itemizedDeductions', e.target.value)}
                          className="border-2 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-600">
                          Charity, mortgage interest, medical expenses (excluding SALT)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="saltDeductions" className="flex items-center gap-2 font-medium">
                          <Building className="h-4 w-4 text-blue-600" />
                          SALT Deductions
                        </Label>
                        <Input
                          id="saltDeductions"
                          type="number"
                          placeholder="12000"
                          value={inputs.saltDeductions || ''}
                          onChange={(e) => handleInputChange('saltDeductions', e.target.value)}
                          className="border-2 focus:border-blue-500"
                        />
                        <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                          🎉 NEW: Increased cap to $40,000 for 2025!
                        </p>
                      </div>
                    </div>

                    <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>2025 Standard Deductions:</strong>
                            <ul className="mt-1 space-y-1">
                              <li>• Single: {formatCurrency(15750)}</li>
                              <li>• Married Joint: {formatCurrency(31500)}</li>
                              <li>• Head of Household: {formatCurrency(23625)}</li>
                            </ul>
                          </div>
                          <div>
                            <strong>Senior Additional (65+):</strong>
                            <ul className="mt-1 space-y-1">
                              <li>• Single: +{formatCurrency(4000)}</li>
                              <li>• Married: +{formatCurrency(6000)} each</li>
                            </ul>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  </TabsContent>

                  {/* Business Tab */}
                  <TabsContent value="business" className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="businessIncome" className="flex items-center gap-2 font-medium">
                          <Briefcase className="h-4 w-4 text-green-600" />
                          Qualified Business Income (QBI)
                        </Label>
                        <Input
                          id="businessIncome"
                          type="number"
                          placeholder="0"
                          value={inputs.businessIncome || ''}
                          onChange={(e) => handleInputChange('businessIncome', e.target.value)}
                          className="border-2 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-600">
                          S-Corps, partnerships, sole proprietorships, rental income
                        </p>
                      </div>

                      <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                        <Briefcase className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-2">
                            <strong className="text-green-900">QBI Deduction Benefits (Permanent):</strong>
                            <ul className="text-sm text-green-800 space-y-1">
                              <li>• 20% deduction on qualified business income</li>
                              <li>• Made permanent under the One Big Beautiful Bill</li>
                              <li>• Subject to taxable income limitations</li>
                              <li>• Applies to most pass-through business income</li>
                            </ul>
                            {inputs.businessIncome > 0 && (
                              <div className="bg-green-100 p-2 rounded mt-2">
                                <strong>Estimated QBI Deduction: {formatCurrency(inputs.businessIncome * 0.2)}</strong>
                              </div>
                            )}
                          </div>
                        </AlertDescription>
                      </Alert>
                    </div>
                  </TabsContent>

                  {/* Special Income Tab */}
                  <TabsContent value="special" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tips" className="flex items-center gap-2 font-medium">
                          <DollarSign className="h-4 w-4 text-yellow-600" />
                          Tips Income
                        </Label>
                        <Input
                          id="tips"
                          type="number"
                          placeholder="0"
                          value={inputs.tips || ''}
                          onChange={(e) => handleInputChange('tips', e.target.value)}
                          className="border-2 focus:border-blue-500"
                        />
                        <p className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
                          🎉 NEW: Tips are tax-deductible for 2025-2028!
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="overtime" className="flex items-center gap-2 font-medium">
                          <Clock className="h-4 w-4 text-blue-600" />
                          Overtime Pay
                        </Label>
                        <Input
                          id="overtime"
                          type="number"
                          placeholder="0"
                          value={inputs.overtime || ''}
                          onChange={(e) => handleInputChange('overtime', e.target.value)}
                          className="border-2 focus:border-blue-500"
                        />
                        <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                          🎉 NEW: Overtime deduction up to {inputs.filingStatus === 'marriedJoint' ? '$25,000' : '$12,500'}
                        </p>
                      </div>
                    </div>

                    <Alert className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                      <Gift className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <strong className="text-yellow-900">Temporary Deductions (2025-2028):</strong>
                          <ul className="text-sm text-yellow-800 space-y-1">
                            <li>• <strong>Tips:</strong> Full deduction for qualifying workers (income &lt; $160k)</li>
                            <li>• <strong>Overtime:</strong> Deduction caps at {inputs.filingStatus === 'marriedJoint' ? '$25,000' : '$12,500'}</li>
                            <li>• Both are above-the-line deductions (reduce AGI)</li>
                            <li>• Valid SSN and qualifying employment required</li>
                          </ul>
                        </div>
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Tax Summary */}
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-blue-50 to-indigo-50">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-6 w-6" />
                  Tax Summary
                </CardTitle>
                <CardDescription className="text-indigo-100">
                  Real-time calculation results
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {results && (
                  <div className="space-y-4">
                    {/* Income Flow */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Gross Income</span>
                        <span className="font-bold text-lg">{formatCurrency(results.grossIncome)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Adjusted Gross Income</span>
                        <span className="font-semibold">{formatCurrency(results.adjustedGrossIncome)}</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Taxable Income</span>
                        <span className="font-semibold">{formatCurrency(results.taxableIncome)}</span>
                      </div>

                      <Separator className="my-4" />

                      {/* Tax Breakdown */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Federal Income Tax</span>
                          <span className="font-semibold text-red-600">{formatCurrency(results.federalIncomeTax)}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">
                            State Income Tax
                            <span className="text-xs text-gray-500 ml-1">({selectedState?.name})</span>
                          </span>
                          <span className="font-semibold text-red-600">
                            {formatCurrency(results.stateIncomeTax)}
                            {!selectedState?.hasIncomeTax && (
                              <Badge variant="outline" className="ml-2 text-xs">No Tax</Badge>
                            )}
                          </span>
                        </div>

                        <Separator />

                        <div className="flex justify-between items-center text-xl py-2 bg-red-50 px-4 rounded-lg">
                          <span className="font-bold text-red-900">Total Tax</span>
                          <span className="font-bold text-red-600">{formatCurrency(results.totalTax)}</span>
                        </div>

                        <div className="flex justify-between items-center text-xl py-2 bg-green-50 px-4 rounded-lg">
                          <span className="font-bold text-green-900">After-Tax Income</span>
                          <span className="font-bold text-green-600">{formatCurrency(results.afterTaxIncome)}</span>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      {/* Tax Rates */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                          <div className="text-sm text-blue-600 font-medium">Effective Rate</div>
                          <div className={`text-2xl font-bold ${effectiveRateColor}`}>
                            {formatPercentage(results.effectiveRate)}
                          </div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                          <div className="text-sm text-blue-600 font-medium">Marginal Rate</div>
                          <div className="text-2xl font-bold text-blue-600">
                            {formatPercentage(results.marginalRate)}
                          </div>
                        </div>
                      </div>

                      {/* Tax Burden Visualization */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Tax Burden</span>
                          <span>{formatPercentage(results.effectiveRate)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(results.effectiveRate, 50) * 2}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0%</span>
                          <span>50%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Deductions & Credits */}
            {results && (
              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Gift className="h-5 w-5" />
                    Deductions & Credits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Standard</span>
                        <span className="font-medium">{formatCurrency(results.standardDeduction)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Itemized</span>
                        <span className="font-medium">{formatCurrency(results.itemizedDeductions)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-green-600">
                        <span>Used</span>
                        <span>{formatCurrency(results.deductionUsed)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {results.qbiDeduction > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">QBI (20%)</span>
                          <span className="font-medium text-green-600">{formatCurrency(results.qbiDeduction)}</span>
                        </div>
                      )}
                      {results.childTaxCredit > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Child Credit</span>
                          <span className="font-medium text-green-600">{formatCurrency(results.childTaxCredit)}</span>
                        </div>
                      )}
                      {results.tipsDeduction > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tips</span>
                          <span className="font-medium text-green-600">{formatCurrency(results.tipsDeduction)}</span>
                        </div>
                      )}
                      {results.overtimeDeduction > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Overtime</span>
                          <span className="font-medium text-green-600">{formatCurrency(results.overtimeDeduction)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* State Information */}
            {selectedState && (
              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <MapPin className="h-5 w-5" />
                    {selectedState.name} Tax Info
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={selectedState.hasIncomeTax ? "destructive" : "secondary"}>
                        {selectedState.hasIncomeTax ? "Has Income Tax" : "No Income Tax"}
                      </Badge>
                      {selectedState.taxType !== 'none' && (
                        <Badge variant="outline">
                          {selectedState.taxType === 'flat' ? 'Flat Tax' : 'Progressive'}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {selectedState.additionalInfo}
                    </p>
                    {selectedState.hasIncomeTax && results && (
                      <div className="text-sm">
                        <div className="flex justify-between items-center">
                          <span>State Tax Owed:</span>
                          <span className="font-bold text-red-600">
                            {formatCurrency(results.stateIncomeTax)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Federal Tax Brackets */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <TrendingUp className="h-5 w-5" />
                  2025 Federal Tax Brackets
                </CardTitle>
                <CardDescription className="text-blue-600">
                  {inputs.filingStatus === 'single' && 'Single Filers'}
                  {inputs.filingStatus === 'marriedJoint' && 'Married Filing Jointly'}
                  {inputs.filingStatus === 'marriedSeparate' && 'Married Filing Separately'}
                  {inputs.filingStatus === 'headOfHousehold' && 'Head of Household'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {FEDERAL_TAX_BRACKETS[inputs.filingStatus].map((bracket, index) => {
                    const isCurrentBracket = results && 
                      results.taxableIncome > bracket.min && 
                      results.taxableIncome <= bracket.max;
                    
                    return (
                      <div 
                        key={index} 
                        className={`flex justify-between items-center py-2 px-3 rounded-lg text-sm transition-colors ${
                          isCurrentBracket 
                            ? 'bg-blue-100 border-2 border-blue-300' 
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <span className={`${isCurrentBracket ? 'font-bold text-blue-900' : 'text-gray-600'}`}>
                          {formatCurrency(bracket.min)} - {bracket.max === Infinity ? '∞' : formatCurrency(bracket.max)}
                        </span>
                        <Badge variant={isCurrentBracket ? "default" : "outline"} className={isCurrentBracket ? 'bg-blue-600' : ''}>
                          {formatPercentage(bracket.rate * 100)}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Alert className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <p className="text-sm">
                <strong>Disclaimer:</strong> This calculator is based on the One Big Beautiful Bill Act of 2025 and provides estimates for educational purposes only. 
                Tax calculations are simplified and should not replace professional tax advice. Consult a qualified tax professional for tax planning and filing.
              </p>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}