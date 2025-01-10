import { useState, useEffect } from 'react';
import { Terminal, Globe2, Info, AlertCircle, Server } from 'lucide-react';

interface IpInfo {
  status: string;
  continent: string;
  continentCode: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  district: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  offset: number;
  currency: string;
  isp: string;
  org: string;
  as: string;
  asname: string;
  reverse: string;
  mobile: boolean;
  proxy: boolean;
  hosting: boolean;
  query: string;
}

function App() {
  const [ip, setIp] = useState('');
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const isValidIPv4 = (ip: string) => {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipv4Regex.test(ip)) return false;
    
    const parts = ip.split('.');
    return parts.every(part => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  };

  const isValidIPv6 = (ip: string) => {
    const ipv6Regex = /^(?:(?:[a-fA-F\d]{1,4}:){7}[a-fA-F\d]{1,4}|(?:[a-fA-F\d]{1,4}:){1,7}:|(?:[a-fA-F\d]{1,4}:){1,6}:[a-fA-F\d]{1,4}|(?:[a-fA-F\d]{1,4}:){1,5}(?::[a-fA-F\d]{1,4}){1,2}|(?:[a-fA-F\d]{1,4}:){1,4}(?::[a-fA-F\d]{1,4}){1,3}|(?:[a-fA-F\d]{1,4}:){1,3}(?::[a-fA-F\d]{1,4}){1,4}|(?:[a-fA-F\d]{1,4}:){1,2}(?::[a-fA-F\d]{1,4}){1,5}|[a-fA-F\d]{1,4}:(?:(?::[a-fA-F\d]{1,4}){1,6})|:(?:(?::[a-fA-F\d]{1,4}){1,7}|:)|fe80:(?::[a-fA-F\d]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(?:ffff(?::0{1,4}){0,1}:){0,1}(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])|(?:[a-fA-F\d]{1,4}:){1,4}:(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
    return ipv6Regex.test(ip);
  };

  const validateIP = (value: string) => {
    if (!value) {
      setValidationError('IP manzilni kiritish majburiy! ');
      return false;
    }
    if (!isValidIPv4(value) && !isValidIPv6(value)) {
      setValidationError('IP manzil formati noto‘g‘ri. Yaroqli IPv4 yoki IPv6 manzilini kiriting.');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIp(value);
    if (value) {
      validateIP(value);
    } else {
      setValidationError('');
    }
  };

  const getIpInfo = async () => {
    if (!validateIP(ip)) {
      return;
    }

    setCountdown(10);
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `http://ip-api.com/json/${ip}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query`
      );
      const data = await response.json();
      if (data.status === 'fail') {
        setError(data.message || "IP maʼlumotlarini olish amalga oshmadi");
        setIpInfo(null);
      } else {
        setIpInfo(data);
      }
    } catch (err) {
      setError('IP maʼlumotlarini olishda xatolik yuz berdi');
      setIpInfo(null);
    } finally {
      setLoading(false);
      setCountdown(0);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono">
      {/* Navbar */}
      <nav className="border-b border-green-500/30 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="w-6 h-6" />
            <span className="text-xl font-bold">IP-Terminal v1.0</span>
          </div>
          {loading && (
            <div className="flex items-center space-x-2 animate-pulse">
              <Server className="w-5 h-5 animate-bounce" />
              <span>Loading...</span>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 space-y-8">
        <div className="bg-gray-900/50 border border-green-500/30 rounded-lg p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-4">
                <Globe2 className="w-5 h-5" />
                <input
                  type="text"
                  value={ip}
                  onChange={handleInputChange}
                  placeholder="IP manzilini kiriting (IPv4 yoki IPv6)..."
                  className={`flex-1 bg-black border rounded px-4 py-2 focus:outline-none ${
                    validationError 
                      ? 'border-red-500/50 focus:border-red-500' 
                      : 'border-green-500/30 focus:border-green-500'
                  }`}
                />
                <button
                  onClick={getIpInfo}
                  disabled={loading || !!validationError || !ip}
                  className={`border rounded px-6 py-2 transition-colors relative ${
                    loading || !!validationError || !ip
                      ? 'bg-gray-500/20 border-gray-500/30 cursor-not-allowed'
                      : 'bg-green-500/20 hover:bg-green-500/30 border-green-500/30'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center space-x-2">
                      <span>Processing</span>
                      <span className="inline-block w-4 text-center">{countdown}</span>
                    </span>
                  ) : (
                    'Get Info'
                  )}
                </button>
              </div>
              {validationError && (
                <div className="flex items-center space-x-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{validationError}</span>
                </div>
              )}
            </div>

            {error && (
              <div className="text-red-500 bg-red-500/10 border border-red-500/30 rounded p-4">
                {error}
              </div>
            )}

            {ipInfo && (
              <>
              <div className="bg-black/50 border border-green-500/30 rounded-lg p-4 space-y-4">
                <div className="flex items-center space-x-2">
                  <Info className="w-5 h-5" />
                  <span className="text-lg">IP Information Results</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(ipInfo).map(([key, value]) => (
                    <div key={key} className="flex space-x-2">
                      <span className="text-green-300">{key}:</span>
                      <span>{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <footer className="border-t border-green-500/30 p-4 mt-8">
              <div className="max-w-7xl mx-auto text-center text-green-500/60">
                <p>&copy; 2024 IP-Terminal. Barcha huquqlar himoyalangan. Tempiltin tomonidan ishlab chiqilgan!</p>
              </div>
            </footer>
            </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      
    </div>
  );
}

export default App;