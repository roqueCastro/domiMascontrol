import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    MapPin,
    Phone,
    MessageCircle,
    ChevronLeft,
    Package,
    Clock,
    CheckCircle2,
    Navigation,
    DollarSign,
    Menu,
    Bell,
    Bike,
    Moon,
    Sun,
    User,
    ArrowRight,
    Map,
    CreditCard,
    Banknote,
    History,
    Calendar,
    TrendingUp,
    FileText,
    Volume2,
    VolumeX,
    Filter,
    X
} from 'lucide-react';

// --- SONIDO DE ALERTA (Base64 corto para no depender de externos) ---
const ALERT_SOUND = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTSVMAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//uQZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWgAAAA0AAAAAAAABAAAAAAAA//uQZAAABxwG2QAIAAAACH5sAAAEbW1tCgAAAAA3bW0KAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZAAABxwG2QAIAAAACH5sAAAEbW1tCgAAAAA3bW0KAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZAAABxwG2QAIAAAACH5sAAAEbW1tCgAAAAA3bW0KAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZAAABxwG2QAIAAAACH5sAAAEbW1tCgAAAAA3bW0KAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZAAAAAAA0gAAABAAAAA0gAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
// Nota: Este es un placeholder. En producción usarías un archivo real.
// Para la demo, usaré un tono simple generado por el navegador o simularé visualmente.

// --- CONFIGURACIÓN DE MARCA ---
const BRAND = {
    primary: '#1abc9c',
    primaryDark: '#16a085',
    secondary: '#2c3e50',
    bgLight: '#f4f6f7',
    bgDark: '#111827',
};

// --- UTILS ---
const formatTime = (dateString) => {
    if(!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate - startDate;
    const diffMins = Math.round(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    if(hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes} min`;
};

// --- MOCK DATA (Fechas reales para filtros) ---
const NOW = new Date();
const YESTERDAY = new Date(NOW); YESTERDAY.setDate(YESTERDAY.getDate() - 1);

const INITIAL_ORDERS = [
    {
        id: 'ORD-767',
        client: 'Andres Murillo',
        phone: '3243591125',
        address: 'Calle 10 # 5-23, Garagoa',
        paymentType: 'cash',
        total: 73500,
        paymentStatus: 'pending',
        status: 'assigned',
        assignedAt: new Date(NOW.getTime() - 15 * 60000).toISOString(), // Hace 15 min
        items: [
            { id: 1, name: 'Churrasco de Res 300gr', qty: 1, price: 36000 },
            { id: 2, name: 'Mazorca Desgranada', qty: 1, price: 30000 },
            { id: 3, name: 'Gaseosa 1.5L', qty: 1, price: 5500 },
            { id: 4, name: 'Domicilio Zona 2', qty: 1, price: 2000 }
        ],
        note: 'Timbre dañado, golpear fuerte.'
    },
    {
        id: 'ORD-765',
        client: 'Dayanis Pérez',
        phone: '3105551234',
        address: 'Av. Circunvalar # 20-10, Centro',
        paymentType: 'transfer',
        total: 45000,
        paymentStatus: 'paid',
        status: 'picking_up',
        assignedAt: new Date(NOW.getTime() - 25 * 60000).toISOString(),
        items: [
            { id: 1, name: 'Hamburguesa Tomahawk', qty: 1, price: 35000 },
            { id: 2, name: 'Papas Fritas', qty: 1, price: 10000 }
        ],
        note: ''
    },
    {
        id: 'ORD-759',
        client: 'Carlos Gomez',
        phone: '3123334444',
        address: 'Conjunto Los Pinos, Apto 402',
        paymentType: 'transfer',
        total: 12500,
        paymentStatus: 'paid',
        status: 'delivered',
        assignedAt: new Date(NOW.getTime() - 120 * 60000).toISOString(),
        deliveredAt: new Date(NOW.getTime() - 90 * 60000).toISOString(), // Hace 1.5 horas
        items: [ { id: 1, name: 'Desayuno Continental', qty: 1, price: 12500 } ],
        note: ''
    },
    {
        id: 'ORD-758',
        client: 'Luisa Lane',
        phone: '3112223333',
        address: 'Calle 100 # 15-20',
        paymentType: 'cash',
        total: 15000,
        paymentStatus: 'paid',
        status: 'delivered',
        assignedAt: YESTERDAY.toISOString(),
        deliveredAt: new Date(YESTERDAY.getTime() + 45 * 60000).toISOString(),
        items: [ { id: 1, name: 'Sandwich Pollo', qty: 1, price: 15000 } ],
        note: ''
    }
];

// --- COMPONENTES AUXILIARES ---

const Badge = ({ children, type, className = '' }) => {
    const colors = {
        success: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
        warning: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
        neutral: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
        brand: 'bg-[#1abc9c]/10 text-[#16a085] border-[#1abc9c]/20 dark:bg-[#1abc9c]/20 dark:text-[#1abc9c] dark:border-[#1abc9c]/30',
        danger: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold border ${colors[type] || colors.neutral} ${className}`}>
      {children}
    </span>
    );
};

const ActionButton = ({ onClick, variant = 'primary', children, className = '', fullWidth = false, icon: Icon }) => {
    const baseStyles = "relative overflow-hidden transition-all duration-200 active:scale-[0.96] flex items-center justify-center gap-2 font-bold py-3.5 px-6 rounded-xl shadow-sm select-none";
    const variants = {
        primary: `bg-[#1abc9c] hover:bg-[#16a085] text-white shadow-[0_4px_14px_0_rgba(26,188,156,0.39)]`,
        secondary: `bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-2 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700`,
    };

    return (
        <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}>
            {Icon && <Icon size={20} strokeWidth={2.5} />}
            {children}
        </button>
    );
};

// --- VISTA DETALLE FLOTANTE (COMPROBANTE) ---
const OrderDetail = ({ order, onBack, onUpdateStatus }) => {
    if (!order) return null;

    const isDelivered = order.status === 'delivered';

    const statusConfig = {
        pending_acceptance: { label: 'ACEPTAR PEDIDO', subLabel: 'Confirmar recepción', next: 'assigned', icon: CheckCircle2, color: 'primary' },
        assigned: { label: 'INICIAR RECOGIDA', subLabel: 'Voy al restaurante', next: 'picking_up', icon: Bike, color: 'primary' },
        picking_up: { label: 'YA LO TENGO', subLabel: 'Iniciar ruta de entrega', next: 'delivering', icon: Navigation, color: 'warning' },
        delivering: { label: 'CONFIRMAR ENTREGA', subLabel: 'Finalizar el pedido', next: 'delivered', icon: CheckCircle2, color: 'success' },
        delivered: { label: 'ENTREGADO', subLabel: 'Orden finalizada', next: null, icon: CheckCircle2, color: 'secondary' }
    };

    const action = statusConfig[order.status];

    return (
        <div className="fixed inset-0 bg-[#f4f6f7] dark:bg-gray-900 z-50 flex flex-col animate-in slide-in-from-right duration-300">

            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm px-4 py-2 flex items-center gap-3 z-20 sticky top-0">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
                    <ChevronLeft size={28} />
                </button>
                <div className="flex-1 text-center mr-10">
                    <h3 className="font-black text-gray-800 dark:text-white text-lg tracking-tight">
                        {isDelivered ? 'COMPROBANTE' : `ORDEN #${order.id.split('-')[1]}`}
                    </h3>
                    <p className="text-xs font-medium text-[#1abc9c] uppercase tracking-wider">
                        {isDelivered ? `Entregado: ${formatTime(order.deliveredAt)}` : 'En Curso'}
                    </p>
                </div>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-4">

                {/* Mapa (Solo si no está entregado) */}
                {!isDelivered && (
                    <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 relative h-48 group transform transition-all hover:scale-[1.01]">
                        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <Map size={48} className="text-gray-300 dark:text-gray-600" />
                        </div>
                        <button className="absolute bottom-3 right-3 bg-[#1abc9c] hover:bg-[#16a085] text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 font-bold text-sm transition-transform active:scale-95 animate-bounce">
                            <Navigation size={16} />
                            IR CON WAZE
                        </button>
                    </div>
                )}

                {/* Card Cliente */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden animate-in slide-in-from-bottom duration-500 delay-100">
                    {isDelivered && (
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <CheckCircle2 size={100} className="text-[#1abc9c]" />
                        </div>
                    )}
                    <div className="flex items-start gap-4 mb-6 relative z-10">
                        <div className={`${isDelivered ? 'bg-gray-100 dark:bg-gray-700 text-gray-400' : 'bg-[#1abc9c]/10 text-[#1abc9c]'} p-3 rounded-2xl`}>
                            <User size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-800 dark:text-white leading-tight">{order.client}</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1 flex items-center gap-1">
                                <MapPin size={14} /> {order.address}
                            </p>
                        </div>
                    </div>

                    {!isDelivered && (
                        <div className="grid grid-cols-2 gap-3">
                            <ActionButton variant="secondary" icon={Phone} className="h-12 text-sm">Llamar</ActionButton>
                            <ActionButton variant="secondary" icon={MessageCircle} className="h-12 text-sm">WhatsApp</ActionButton>
                        </div>
                    )}
                </div>

                {/* Tiempos Detallados (Nuevo) */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 flex justify-between items-center text-sm border border-gray-100 dark:border-gray-700 animate-in slide-in-from-bottom duration-500 delay-200">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-bold uppercase">Asignado</span>
                        <span className="font-bold text-gray-700 dark:text-gray-200">{formatTime(order.assignedAt)}</span>
                    </div>
                    {isDelivered ? (
                        <>
                            <div className="h-8 w-px bg-gray-200 dark:bg-gray-600 mx-2"></div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400 font-bold uppercase">Entregado</span>
                                <span className="font-bold text-gray-700 dark:text-gray-200">{formatTime(order.deliveredAt)}</span>
                            </div>
                            <div className="h-8 w-px bg-gray-200 dark:bg-gray-600 mx-2"></div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400 font-bold uppercase">Tiempo Total</span>
                                <span className="font-bold text-[#1abc9c]">{calculateDuration(order.assignedAt, order.deliveredAt)}</span>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 text-[#1abc9c] font-bold bg-[#1abc9c]/10 px-3 py-1 rounded-full animate-pulse">
                            <Clock size={16} /> En curso
                        </div>
                    )}
                </div>

                {/* Detalle Financiero */}
                <div className={`p-5 rounded-3xl border-2 flex justify-between items-center animate-in slide-in-from-bottom duration-500 delay-300 ${
                    order.paymentStatus === 'paid'
                        ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800'
                        : 'bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-800'
                }`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${order.paymentStatus === 'paid' ? 'bg-emerald-200 text-emerald-700' : 'bg-red-200 text-red-700'}`}>
                            {order.paymentStatus === 'paid' ? <CheckCircle2 size={20}/> : <DollarSign size={20}/>}
                        </div>
                        <div>
                            <p className={`text-xs font-black uppercase ${order.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-red-700'}`}>
                                {order.paymentStatus === 'paid' ? 'YA PAGADO' : 'COBRAR EN EFECTIVO'}
                            </p>
                            <p className="text-xs text-gray-500 font-medium">
                                {order.paymentType === 'transfer' ? 'Transferencia' : 'Efectivo'}
                            </p>
                        </div>
                    </div>
                    <span className="text-2xl font-black text-gray-800 dark:text-white">${order.total.toLocaleString()}</span>
                </div>

                {/* Lista Productos */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 animate-in slide-in-from-bottom duration-500 delay-300">
                    <h4 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                        <Package size={16} /> Productos
                    </h4>
                    <div className="space-y-4">
                        {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                            <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold px-2 py-1 rounded-md text-xs min-w-[2rem] text-center">
                                {item.qty}x
                            </span>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{item.name}</span>
                                </div>
                                <span className="text-sm text-gray-500 font-medium">${(item.price * item.qty).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between">
                        <span className="font-bold text-gray-800 dark:text-white">Total Final</span>
                        <span className="font-bold text-[#1abc9c]">${order.total.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Footer Action (Solo si no es historial) */}
            {!isDelivered && action.next && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 z-20">
                    <button
                        onClick={() => onUpdateStatus(order.id, action.next)}
                        className={`w-full py-4 rounded-2xl shadow-lg transform transition-all active:scale-[0.98] flex items-center justify-between px-6 group
                ${
                            action.color === 'warning' ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30' :
                                action.color === 'success' ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30' :
                                    'bg-[#1abc9c] hover:bg-[#16a085] text-white shadow-[#1abc9c]/30'
                        }`}
                    >
                        <div className="flex flex-col items-start">
                            <span className="text-lg font-black uppercase tracking-wide">{action.label}</span>
                            <span className="text-xs opacity-90 font-medium">{action.subLabel}</span>
                        </div>
                        <div className="bg-white/20 p-2 rounded-full group-hover:translate-x-1 transition-transform">
                            <ArrowRight size={24} />
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};

// --- CARD COMPONENTE ---
const OrderCard = ({ order, onClick, showTimeDetails = false }) => {
    const isDelivered = order.status === 'delivered';
    const steps = ['assigned', 'picking_up', 'delivering', 'delivered'];
    const currentStepIndex = steps.indexOf(order.status);
    const progress = ((currentStepIndex) / (steps.length - 1)) * 100;

    // Calcular tiempo transcurrido para pedidos activos
    const [elapsed, setElapsed] = useState('');

    useEffect(() => {
        if (isDelivered) return;
        const interval = setInterval(() => {
            const now = new Date();
            const start = new Date(order.assignedAt);
            const diffMins = Math.floor((now - start) / 60000);
            setElapsed(`${diffMins} min`);
        }, 60000);

        // Init immediately
        const now = new Date();
        const start = new Date(order.assignedAt);
        const diffMins = Math.floor((now - start) / 60000);
        setElapsed(`${diffMins} min`);

        return () => clearInterval(interval);
    }, [order.assignedAt, isDelivered]);

    const getStatusColor = (status) => {
        if (status === 'assigned') return 'bg-sky-500';
        if (status === 'picking_up') return 'bg-amber-500';
        if (status === 'delivering') return 'bg-[#1abc9c]';
        return 'bg-gray-400';
    };

    const getStatusLabel = (status) => {
        if (status === 'assigned') return 'Asignado';
        if (status === 'picking_up') return 'Recogiendo';
        if (status === 'delivering') return 'En Camino';
        return 'Entregado';
    };

    return (
        <div
            onClick={() => onClick(order)}
            className={`relative bg-white dark:bg-gray-800 rounded-3xl shadow-sm border transition-all duration-300 cursor-pointer overflow-hidden group animate-in fade-in zoom-in-95
      ${isDelivered
                ? 'border-gray-100 dark:border-gray-700 opacity-90 hover:opacity-100'
                : 'border-gray-100 dark:border-gray-700 hover:shadow-md hover:-translate-y-1'
            }`}
        >
            {/* Barra de Progreso */}
            {!isDelivered && (
                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700">
                    <div className={`h-full transition-all duration-1000 ease-out ${getStatusColor(order.status)}`} style={{ width: `${progress || 10}%` }}></div>
                </div>
            )}

            <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm transition-transform group-hover:scale-110
                        ${isDelivered ? 'bg-gray-100 text-gray-400 dark:bg-gray-700' : getStatusColor(order.status)}`}>
                            {order.status === 'picking_up' ? <Bike size={18}/> :
                                order.status === 'delivering' ? <Navigation size={18}/> :
                                    isDelivered ? <CheckCircle2 size={18}/> : <Package size={18}/>}
                        </div>
                        <div>
                            <h3 className={`font-black text-base leading-tight ${isDelivered ? 'text-gray-600 dark:text-gray-400' : 'text-gray-800 dark:text-white'}`}>
                                {order.client}
                            </h3>
                            <div className="flex items-center gap-1 mt-1">
                                {order.paymentStatus === 'paid' ? (
                                    <Badge type="success">PAGADO</Badge>
                                ) : (
                                    <Badge type="danger">COBRAR</Badge>
                                )}
                                <span className="text-[10px] font-semibold text-gray-400">
                                • #{order.id.split('-')[1]}
                            </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                    <span className={`text-lg font-black ${isDelivered ? 'text-gray-600 dark:text-gray-400' : 'text-[#1abc9c]'}`}>
                        ${order.total.toLocaleString()}
                    </span>
                        {isDelivered ? (
                            <span className="text-[10px] font-bold text-gray-400 mt-1">
                            {formatTime(order.deliveredAt)}
                        </span>
                        ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 mt-1 flex items-center gap-1 animate-pulse">
                            <Clock size={10} /> {elapsed}
                        </span>
                        )}
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <MapPin size={14} className="text-gray-400 shrink-0" />
                        <p className="text-xs text-gray-600 dark:text-gray-300 font-medium truncate pr-2">
                            {order.address}
                        </p>
                    </div>
                    <Badge type={isDelivered ? 'neutral' : 'brand'} className={isDelivered ? '' : '!bg-[#1abc9c] !text-white !border-0'}>
                        {getStatusLabel(order.status)}
                    </Badge>
                </div>

                {/* Tiempos detallados solo en historial expandido */}
                {showTimeDetails && isDelivered && (
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-2">
                        <div className="text-[10px] text-gray-500">
                            <span className="font-bold">Inicio:</span> {formatTime(order.assignedAt)}
                        </div>
                        <div className="text-[10px] text-gray-500 text-right">
                            <span className="font-bold">Duración:</span> {calculateDuration(order.assignedAt, order.deliveredAt)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- COMPONENTE STATS GENERAL ---
const ActiveStats = ({ orders }) => {
    const cash = orders.filter(o => o.status !== 'delivered' && o.paymentType === 'cash').reduce((s, o) => s + o.total, 0);
    return (
        <div className="bg-[#1abc9c] rounded-3xl p-6 text-white shadow-lg shadow-[#1abc9c]/30 mb-6 relative overflow-hidden animate-in slide-in-from-top duration-500">
            <div className="absolute right-0 top-0 p-6 opacity-10 animate-pulse"><Bike size={100} /></div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-90 mb-1">Por Cobrar en Ruta</p>
            <h2 className="text-4xl font-black mb-4 tracking-tight">${cash.toLocaleString()}</h2>
            <div className="flex gap-4 text-sm font-bold">
                <span className="bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm flex items-center gap-2">
                    <Package size={14}/>
                    {orders.filter(o => ['assigned', 'picking_up', 'delivering'].includes(o.status)).length} Activos
                </span>
            </div>
        </div>
    )
}

// --- COMPONENTE HISTORIAL FILTRABLE ---
const HistoryView = ({ orders, onSelect }) => {
    const [filterMode, setFilterMode] = useState('day'); // 'day' | 'month'
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

    // Lógica de filtrado
    const filteredHistory = useMemo(() => {
        return orders.filter(order => {
            const orderDate = order.deliveredAt.split('T')[0]; // YYYY-MM-DD
            const orderMonth = order.deliveredAt.slice(0, 7); // YYYY-MM

            if (filterMode === 'day') return orderDate === selectedDate;
            if (filterMode === 'month') return orderMonth === selectedMonth;
            return true;
        });
    }, [orders, filterMode, selectedDate, selectedMonth]);

    // Totales
    const totalHistory = filteredHistory.reduce((acc, o) => acc + o.total, 0);
    const totalCash = filteredHistory.filter(o => o.paymentType === 'cash').reduce((acc, o) => acc + o.total, 0);
    const totalTransfer = filteredHistory.filter(o => o.paymentType === 'transfer').reduce((acc, o) => acc + o.total, 0);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Barra de Filtros */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm flex items-center gap-3 overflow-x-auto">
                <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl shrink-0">
                    <button
                        onClick={() => setFilterMode('day')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${filterMode === 'day' ? 'bg-white dark:bg-gray-600 text-[#1abc9c] shadow-sm' : 'text-gray-500'}`}
                    >Dia</button>
                    <button
                        onClick={() => setFilterMode('month')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${filterMode === 'month' ? 'bg-white dark:bg-gray-600 text-[#1abc9c] shadow-sm' : 'text-gray-500'}`}
                    >Mes</button>
                </div>

                {filterMode === 'day' ? (
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700 border-none text-sm font-bold text-gray-700 dark:text-white rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#1abc9c]"
                    />
                ) : (
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700 border-none text-sm font-bold text-gray-700 dark:text-white rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#1abc9c]"
                    />
                )}
            </div>

            {/* Resumen Financiero (Cierre de Caja) */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                <div className="absolute right-0 top-0 p-4 opacity-5 text-[#1abc9c]">
                    <TrendingUp size={80} />
                </div>
                <div className="flex items-center gap-2 mb-4 relative z-10">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg text-emerald-600">
                        <TrendingUp size={20} />
                    </div>
                    <h3 className="font-black text-gray-800 dark:text-white text-lg">
                        {filterMode === 'day' ? 'Cierre del Día' : 'Cierre Mensual'}
                    </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <p className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1"><Banknote size={12}/> Efectivo</p>
                        <p className="text-lg font-black text-gray-800 dark:text-white">${totalCash.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <p className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1"><CreditCard size={12}/> Digital</p>
                        <p className="text-lg font-black text-gray-800 dark:text-white">${totalTransfer.toLocaleString()}</p>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center relative z-10">
                    <span className="text-sm font-bold text-gray-500">Total Recaudado</span>
                    <span className="text-xl font-black text-[#1abc9c]">${totalHistory.toLocaleString()}</span>
                </div>
            </div>

            {/* Lista */}
            <div className="space-y-3">
                {filteredHistory.length > 0 ? (
                    filteredHistory.map(order => (
                        <OrderCard key={order.id} order={order} onClick={onSelect} showTimeDetails={true} />
                    ))
                ) : (
                    <div className="text-center py-12 opacity-50">
                        <p className="text-gray-400 font-medium">No hay registros para esta fecha.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- APP PRINCIPAL ---
export default function App() {
    const [darkMode, setDarkMode] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [activeTab, setActiveTab] = useState('assigned');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orders, setOrders] = useState(INITIAL_ORDERS);

    // Audio Ref
    const audioRef = useRef(null);

    useEffect(() => {
        if (darkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [darkMode]);

    // Función para reproducir sonido
    const playSound = () => {
        if(soundEnabled && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.log("Audio play blocked", e));
        }
    };

    // Simulador de nuevo pedido
    const simulateNewOrder = () => {
        const newOrder = {
            id: `ORD-${Math.floor(Math.random() * 1000)}`,
            client: 'Cliente Nuevo',
            phone: '300000000',
            address: 'Calle Nueva # 1-23',
            paymentType: 'cash',
            total: 25000,
            paymentStatus: 'pending',
            status: 'assigned',
            assignedAt: new Date().toISOString(),
            items: [{ id: 1, name: 'Pizza', qty: 1, price: 25000 }],
        };
        setOrders(prev => [newOrder, ...prev]);
        playSound();

        // Notificación visual temporal
        if ("vibrate" in navigator) navigator.vibrate(200);
    };

    const handleUpdateStatus = (orderId, newStatus) => {
        const now = new Date().toISOString();
        setOrders(prev => prev.map(o => {
            if (o.id === orderId) {
                const updated = { ...o, status: newStatus };
                if (newStatus === 'delivered') updated.deliveredAt = now;
                return updated;
            }
            return o;
        }));
        if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder(prev => ({ ...prev, status: newStatus, ...(newStatus === 'delivered' ? { deliveredAt: now } : {}) }));
        }
    };

    const activeOrders = useMemo(() => orders.filter(o => ['assigned', 'picking_up', 'delivering'].includes(o.status)), [orders]);
    const historyOrders = useMemo(() => orders.filter(o => o.status === 'delivered'), [orders]);

    return (
        <div className={`min-h-screen font-sans selection:bg-[#1abc9c]/30 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-[#f4f6f7] text-gray-800'}`}>

            <audio ref={audioRef} src={ALERT_SOUND} />

            {/* Header */}
            <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 px-4 py-3 shadow-sm border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-[#1abc9c] p-2 rounded-xl text-white shadow-md shadow-[#1abc9c]/20">
                        <Bike size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="font-black text-lg leading-none tracking-tight text-gray-800 dark:text-white">
                            +CONTROL <span className="text-[#1abc9c]">GO</span>
                        </h1>
                        <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-0.5">Sistema Logístico</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setSoundEnabled(!soundEnabled);
                            if(!soundEnabled) playSound(); // Test sound
                        }}
                        className={`p-2.5 rounded-full transition-colors ${soundEnabled ? 'bg-[#1abc9c]/10 text-[#1abc9c]' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}
                    >
                        {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                    </button>
                    <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>
            </header>

            <main className="max-w-md mx-auto p-4 pb-24">

                {/* Panel Activo (Solo visible en pestaña 'assigned') */}
                {activeTab === 'assigned' && <ActiveStats orders={activeOrders} />}

                {/* Botón Simulación (SOLO DEMO) */}
                {activeTab === 'assigned' && (
                    <button
                        onClick={simulateNewOrder}
                        className="w-full mb-6 py-2 text-xs font-bold uppercase tracking-wider bg-gray-200 dark:bg-gray-700 text-gray-500 rounded-lg hover:bg-[#1abc9c] hover:text-white transition-colors border border-dashed border-gray-300 dark:border-gray-600"
                    >
                        🔔 Simular Nuevo Pedido
                    </button>
                )}

                {/* Tabs */}
                <div className="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-2xl mb-6 relative">
                    <button
                        onClick={() => setActiveTab('assigned')}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide flex items-center justify-center gap-2 transition-all z-10
            ${activeTab === 'assigned' ? 'bg-white dark:bg-gray-700 text-[#1abc9c] shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                    >
                        Activos
                        {activeOrders.length > 0 && (
                            <span className="bg-[#1abc9c] text-white text-[9px] px-1.5 rounded-full animate-pulse">{activeOrders.length}</span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide flex items-center justify-center gap-2 transition-all z-10
            ${activeTab === 'history' ? 'bg-white dark:bg-gray-700 text-[#1abc9c] shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                    >
                        Historial
                        <History size={14} />
                    </button>
                </div>

                {/* Contenido Principal */}
                <div className="space-y-4 min-h-[300px]">
                    {activeTab === 'assigned' ? (
                        activeOrders.length > 0 ? (
                            activeOrders.map(order => (
                                <OrderCard key={order.id} order={order} onClick={setSelectedOrder} />
                            ))
                        ) : (
                            <div className="text-center py-10 opacity-50 animate-in fade-in duration-700">
                                <div className="bg-gray-200 dark:bg-gray-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-3">
                                    <Bike size={32} className="text-gray-400"/>
                                </div>
                                <p className="font-bold text-gray-500">Sin pedidos activos</p>
                            </div>
                        )
                    ) : (
                        /* VISTA DE HISTORIAL MEJORADA */
                        <HistoryView orders={historyOrders} onSelect={setSelectedOrder} />
                    )}
                </div>

            </main>

            {/* Detalle Modal */}
            {selectedOrder && (
                <OrderDetail
                    order={selectedOrder}
                    onBack={() => setSelectedOrder(null)}
                    onUpdateStatus={handleUpdateStatus}
                />
            )}

        </div>
    );
}