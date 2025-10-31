import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calculator, TrendingUp } from "../lib/icons";

export function CalorieCalculator() {
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activity, setActivity] = useState("");
  const [result, setResult] = useState<{
    bmr: number;
    tdee: number;
    maintain: number;
    loseWeight: number;
    gainWeight: number;
  } | null>(null);

  const calculateCalories = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (!w || !h || !a || !gender || !activity) {
      return;
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr: number;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    // Activity multipliers
    const activityMultipliers: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    const tdee = bmr * activityMultipliers[activity];

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      maintain: Math.round(tdee),
      loseWeight: Math.round(tdee - 500),
      gainWeight: Math.round(tdee + 500),
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-br from-purple-100 to-purple-200 rounded-full mb-4 shadow-md">
            <Calculator className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600" />
          </div>
          <h1 className="bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent mb-2 text-2xl sm:text-3xl md:text-4xl font-bold">
            Kalkulator Kalori Pribadi
          </h1>
          <p className="text-gray-700 text-sm sm:text-base px-4">
            Hitung kebutuhan kalori harian Anda berdasarkan profil dan aktivitas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Calculator Form */}
          <Card className="shadow-lg border-2 border-purple-100">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <div className="w-6 h-6 bg-purple-600 rounded-md flex items-center justify-center">
                  <Calculator className="w-4 h-4 text-white" />
                </div>
                Data Diri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label>Jenis Kelamin</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Laki-laki</SelectItem>
                    <SelectItem value="female">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Usia (tahun)</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Berat Badan (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="60"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Tinggi Badan (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="165"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Tingkat Aktivitas</Label>
                <Select value={activity} onValueChange={setActivity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tingkat aktivitas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">
                      Sangat Jarang (tidak olahraga)
                    </SelectItem>
                    <SelectItem value="light">
                      Ringan (1-3x seminggu)
                    </SelectItem>
                    <SelectItem value="moderate">
                      Sedang (3-5x seminggu)
                    </SelectItem>
                    <SelectItem value="active">
                      Aktif (6-7x seminggu)
                    </SelectItem>
                    <SelectItem value="very_active">
                      Sangat Aktif (atlet)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={calculateCalories}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Hitung Kalori
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-4 sm:space-y-6">
            {result ? (
              <>
                <Card className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 text-white shadow-xl border-0">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <p className="text-white/90 text-sm sm:text-base">
                        Kebutuhan Kalori Harian
                      </p>
                    </div>
                    <p className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1">
                      {result.maintain}
                    </p>
                    <p className="text-white/90">kalori/hari</p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-2 border-orange-100">
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                    <CardTitle className="flex items-center gap-2 text-orange-900">
                      <div className="w-6 h-6 bg-orange-600 rounded-md flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      Detail Kalori
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          BMR (Metabolisme Basal)
                        </p>
                        <p className="text-xs text-gray-500">
                          Kalori saat istirahat
                        </p>
                      </div>
                      <p className="text-purple-900 font-bold text-lg">
                        {result.bmr} kal
                      </p>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          TDEE (Total Daily Energy)
                        </p>
                        <p className="text-xs text-gray-500">
                          Dengan aktivitas
                        </p>
                      </div>
                      <p className="text-purple-900 font-bold text-lg">
                        {result.tdee} kal
                      </p>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-gray-200 bg-blue-50 -mx-6 px-6 py-3 rounded">
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Untuk Menurunkan BB
                        </p>
                        <p className="text-xs text-gray-500">-0.5 kg/minggu</p>
                      </div>
                      <p className="text-blue-700 font-bold text-lg">
                        {result.loseWeight} kal
                      </p>
                    </div>

                    <div className="flex justify-between items-center bg-orange-50 -mx-6 px-6 py-3 rounded">
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Untuk Menaikkan BB
                        </p>
                        <p className="text-xs text-gray-500">+0.5 kg/minggu</p>
                      </div>
                      <p className="text-orange-700 font-bold text-lg">
                        {result.gainWeight} kal
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-md">
                  <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100">
                    <CardTitle className="text-green-900 flex items-center gap-2">
                      <span className="text-2xl">🥗</span>
                      Rekomendasi Produk Freshify
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-gray-700 mb-4 font-medium">
                      Berdasarkan kebutuhan kalori Anda, kami merekomendasikan:
                    </p>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">🥤</span>
                        <span>2-3 porsi Juicy Balance per hari (~300 kal)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 mt-0.5">🍪</span>
                        <span>
                          2 porsi Fit Bites sebagai camilan (~360 kal)
                        </span>
                      </li>
                      <li>• Kombinasikan dengan makanan utama yang sehat</li>
                    </ul>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-gray-50 border-dashed">
                <CardContent className="pt-6 text-center py-12">
                  <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Isi data di sebelah kiri untuk menghitung kebutuhan kalori
                    Anda
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
