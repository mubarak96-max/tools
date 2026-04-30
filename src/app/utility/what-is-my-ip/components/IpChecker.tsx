'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Globe, 
  MapPin, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  Hash, 
  Radio, 
  Home, 
  Copy, 
  RefreshCw, 
  AlertTriangle, 
  Map, 
  Check, 
  Search,
  ExternalLink,
  ShieldQuestion,
  Lock
} from 'lucide-react';

interface IpApiData {
  ip: string;
  version: 'IPv4' | 'IPv6';
  city: string;
  region: string;
  region_code: string;
  country_name: string;
  country_code: string;
  continent_code: string;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  org: string;
  asn: string;
  network: string;
  country_calling_code?: string;
  currency?: string;
  languages?: string;
}

interface PrivateIp {
  address: string;
  type: 'IPv4' | 'IPv6';
  interface?: string;
}

export default function IpChecker() {
  const [data, setData] = useState<IpApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [privateIps, setPrivateIps] = useState<PrivateIp[]>([]);
  const [privateLoading, setPrivateLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const isPotentialProxy = useCallback((org: string = '') => {
    const proxyKeywords = ['vpn', 'proxy', 'hosting', 'datacenter', 'cloudflare', 'google llc', 'amazon', 'microsoft', 'digitalocean', 'linode', 'vultr', 'ovh', 'hetzner', 'contabo', 'alibaba', 'tencent'];
    return proxyKeywords.some(k => org.toLowerCase().includes(k));
  }, []);

  const fetchPublicIp = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Primary source
      const res = await fetch('https://ipapi.co/json/');
      if (!res.ok) throw new Error('Primary API failed');
      const json = await res.json();
      if (json.error) throw new Error(json.reason);
      setData(json);
      setLastUpdated(new Date());
    } catch (err) {
      // Fallback to ipify + geojs
      try {
        const [ipRes, geoRes] = await Promise.all([
          fetch('https://api.ipify.org?format=json'),
          fetch('https://get.geojs.io/v1/ip/geo.json')
        ]);
        const { ip } = await ipRes.json();
        const geo = await geoRes.json();
        setData({
          ip,
          version: ip.includes(':') ? 'IPv6' : 'IPv4',
          city: geo.city || 'Unknown',
          region: geo.region || 'Unknown',
          region_code: geo.region_code || '',
          country_name: geo.country || 'Unknown',
          country_code: geo.country_code || '',
          continent_code: geo.continent_code || '',
          postal: geo.postal || '',
          latitude: parseFloat(geo.latitude) || 0,
          longitude: parseFloat(geo.longitude) || 0,
          timezone: geo.timezone || 'Unknown',
          utc_offset: '',
          org: geo.organization_name || 'Unknown',
          asn: geo.asn || '',
          network: '',
        });
        setLastUpdated(new Date());
      } catch {
        setError('Unable to retrieve IP information. Please disable your ad blocker or try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPrivateIps = useCallback(() => {
    setPrivateLoading(true);
    const ips: PrivateIp[] = [];
    
    try {
      const pc = new RTCPeerConnection({ 
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] 
      });
      
      pc.createDataChannel('');

      pc.onicecandidate = (e) => {
        if (!e.candidate) {
          pc.close();
          setPrivateIps(ips);
          setPrivateLoading(false);
          return;
        }
        
        const candidateStr = e.candidate.candidate;
        // Extract IP from candidate string
        const ipRegex = /([0-9a-fA-F.:]+)/g;
        const matches = candidateStr.match(ipRegex);
        
        if (matches) {
          matches.forEach(ip => {
            // Filter out mDNS .local addresses and duplicates
            if (!ip.includes('.local') && !ips.some(i => i.address === ip)) {
              const isV6 = ip.includes(':');
              // Basic validation to ensure it looks like an IP
              if (isV6 || /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip)) {
                ips.push({
                  address: ip,
                  type: isV6 ? 'IPv6' : 'IPv4'
                });
              }
            }
          });
        }
      };

      pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .catch(() => {
          setPrivateLoading(false);
        });

      // Timeout fallback
      setTimeout(() => {
        pc.close();
        if (ips.length === 0) {
          setPrivateIps([]);
        } else {
          setPrivateIps(ips);
        }
        setPrivateLoading(false);
      }, 4000);
    } catch {
      setPrivateLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPublicIp();
    fetchPrivateIps();
  }, [fetchPublicIp, fetchPrivateIps]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-12 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-medium">Detecting your network identity...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
        <div className="text-4xl mb-4 text-amber-500">
          <AlertTriangle size={48} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Detection Failed</h3>
        <p className="text-slate-600 mb-6 max-w-md">{error}</p>
        <button 
          onClick={fetchPublicIp}
          className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const proxyWarning = isPotentialProxy(data.org);

  return (
    <div className="w-full space-y-6">
      {/* HERO IP DISPLAY */}
      <div className="bg-slate-900 rounded-2xl p-8 lg:p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 mb-6">
            <span className={`w-2 h-2 rounded-full ${data.version === 'IPv4' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            {data.version} Public Address
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-mono font-bold text-white tracking-wider mb-2 break-all">
            {data.ip}
          </h2>
          
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => handleCopy(data.ip)}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-all active:scale-95"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied' : 'Copy IP'}
            </button>
            <button
              onClick={() => {
                fetchPublicIp();
                fetchPrivateIps();
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all border border-slate-700"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>

          {proxyWarning && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-sm">
              <ShieldAlert size={18} className="text-amber-400" />
              <span><strong>Proxy/VPN Detected:</strong> Your traffic appears to route through {data.org || 'a data center'}. The IP above may be your proxy server address.</span>
            </div>
          )}

          {lastUpdated && (
            <p className="mt-4 text-xs text-slate-500">
              Last checked: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {/* INFO GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Location */}
        <InfoCard 
          icon={<MapPin size={20} className="text-indigo-600" />} 
          label="Location" 
          value={`${data.city}, ${data.region}`}
          sub={`${data.country_name} (${data.country_code}) • ${data.postal}`}
          highlight
        />
        
        {/* ISP */}
        <InfoCard 
          icon={<Globe size={20} className="text-indigo-600" />} 
          label="ISP / Organization" 
          value={data.org || 'Unknown'}
          sub={`ASN: ${data.asn || 'N/A'}`}
        />
        
        {/* Coordinates */}
        <InfoCard 
          icon={<Map size={20} className="text-indigo-600" />} 
          label="Coordinates" 
          value={`${data.latitude.toFixed(4)}, ${data.longitude.toFixed(4)}`}
          sub={
            <a 
              href={`https://www.google.com/maps?q=${data.latitude},${data.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-indigo-600 hover:underline"
            >
              View on Google Maps <ExternalLink size={14} />
            </a>
          }
        />
        
        {/* Timezone */}
        <InfoCard 
          icon={<Clock size={20} className="text-indigo-600" />} 
          label="Timezone" 
          value={data.timezone}
          sub={data.utc_offset ? `UTC Offset: ${data.utc_offset}` : undefined}
        />
        
        {/* Network */}
        <InfoCard 
          icon={<Hash size={20} className="text-indigo-600" />} 
          label="Network Range" 
          value={data.network || 'N/A'}
          sub="Assigned IP block"
        />
        
        {/* Connection Type */}
        <InfoCard 
          icon={<Radio size={20} className="text-indigo-600" />} 
          label="Connection" 
          value={data.version}
          sub={proxyWarning ? 'Likely proxied/VPN' : 'Direct / Residential'}
          highlight={!proxyWarning}
        />
      </div>

      {/* PRIVATE IP SECTION */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Private / Local IP Addresses</h3>
            <p className="text-sm text-slate-500">Detected via WebRTC (your internal network identity)</p>
          </div>
          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wide">
            Browser API
          </span>
        </div>

        {privateLoading ? (
          <div className="flex items-center gap-3 text-slate-500 py-4">
            <div className="w-5 h-5 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
            Scanning local interfaces...
          </div>
        ) : privateIps.length > 0 ? (
          <div className="space-y-2">
            {privateIps.map((ip, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-xl text-indigo-600">
                    <Home size={24} />
                  </span>
                  <div>
                    <p className="font-mono font-semibold text-slate-900">{ip.address}</p>
                    <p className="text-xs text-slate-500">Local {ip.type} • RFC1918 Interface</p>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(ip.address)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Copy size={14} />
                  Copy
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 text-sm">
            <div className="flex items-center gap-2 font-medium mb-1 text-slate-900">
              <ShieldQuestion size={18} className="text-slate-400" />
              Unable to detect local IP
            </div>
            <p>Modern browsers (Chrome, Firefox, Safari) increasingly obscure local IP addresses via mDNS for privacy. To see your private IP, check your system settings:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-slate-500">
              <li><strong>Windows:</strong> Run <code>ipconfig</code> in Command Prompt</li>
              <li><strong>Mac:</strong> Run <code>ifconfig</code> in Terminal, or check System Settings → Network</li>
              <li><strong>Linux:</strong> Run <code>ip addr</code> or <code>hostname -I</code></li>
              <li><strong>iPhone/Android:</strong> Settings → Wi-Fi → Tap your network</li>
            </ul>
          </div>
        )}
      </div>

      {/* SECURITY ANALYSIS */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={20} className="text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-900">Privacy & Security Analysis</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <SecurityRow 
            label="IP Version"
            status={data.version === 'IPv6' ? 'info' : 'neutral'}
            text={data.version === 'IPv6' 
              ? 'You are using IPv6. Your address is globally unique and less likely to be behind carrier-grade NAT.' 
              : 'You are using IPv4. Most residential connections share IPv4 addresses via NAT to mitigate address exhaustion.'}
          />
          <SecurityRow 
            label="Proxy / VPN Detection"
            status={proxyWarning ? 'warning' : 'success'}
            text={proxyWarning 
              ? `Your IP belongs to "${data.org}", which resembles a hosting or VPN provider. This is likely your proxy server address.` 
              : 'Your IP appears to originate from a residential or business ISP, suggesting a direct connection.'}
          />
          <SecurityRow 
            label="Geolocation Accuracy"
            status="neutral"
            text={`Location data is accurate to the city level (${data.city}). It cannot pinpoint your exact street address without a legal request to your ISP.`}
          />
          <SecurityRow 
            label="WebRTC Leak Test"
            status={privateIps.length > 0 ? 'warning' : 'success'}
            text={privateIps.length > 0 
              ? 'Your browser revealed local IP addresses via WebRTC. If you use a VPN, this could expose your real network identity.' 
              : 'Your browser is blocking WebRTC IP leaks. Your local network identity is hidden.'}
          />
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value, sub, highlight }: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  sub?: React.ReactNode; 
  highlight?: boolean 
}) {
  return (
    <div className={`p-5 rounded-xl border transition-all ${highlight ? 'bg-indigo-50/50 border-indigo-200' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
      </div>
      <p className="text-lg font-bold text-slate-900 break-words">{value}</p>
      {sub && <div className="text-sm text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}

function SecurityRow({ label, status, text }: { label: string; status: 'success' | 'warning' | 'info' | 'neutral'; text: string }) {
  const colors = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    neutral: 'bg-slate-50 border-slate-200 text-slate-700',
  };
  
  const icons = {
    success: <ShieldCheck size={18} />,
    warning: <ShieldAlert size={18} />,
    info: <Shield size={18} />,
    neutral: <Search size={18} />,
  };

  return (
    <div className={`p-4 rounded-xl border ${colors[status]}`}>
      <div className="flex items-start gap-3">
        <span className="font-bold mt-0.5">{icons[status]}</span>
        <div>
          <p className="font-semibold text-sm mb-1">{label}</p>
          <p className="text-sm opacity-90 leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}
