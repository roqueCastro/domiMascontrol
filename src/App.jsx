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
    Bike,
    Moon,
    Sun,
    User,
    ArrowRight,
    Map,
    CreditCard,
    Banknote,
    History,
    TrendingUp,
    X,
    Edit3,
    Save,
    StickyNote,
    AlertTriangle,
    Undo2,
    XCircle,
    ThumbsUp,
    ThumbsDown,
    Bell,
    UserCircle,
    LogOut,
    ChevronRight,
    ShieldCheck,
    Camera,
    Lock,
    Smartphone,
    Store,
    Ghost
} from 'lucide-react';

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

// --- MOCK DATA ---
const NOW = new Date();
const YESTERDAY = new Date(NOW); YESTERDAY.setDate(YESTERDAY.getDate() - 1);

const INITIAL_ORDERS = [
    {
        id: 'ORD-999',
        client: 'Juan Cliente',
        phone: '3100000000',
        address: 'Calle 80 # 10-10, Norte',
        paymentType: 'cash',
        total: 18500,
        paymentStatus: 'pending',
        status: 'pending_acceptance',
        assignedAt: new Date().toISOString(),
        items: [
            { id: 1, name: 'Burrito Mexicano', qty: 1, price: 18500 }
        ],
        note: 'Ojo con la salsa picante aparte'
    },
    {
        id: 'ORD-767',
        client: 'Andres Murillo',
        phone: '3243591125',
        address: 'Calle 10 # 5-23, Garagoa',
        paymentType: 'cash',
        total: 73500,
        paymentStatus: 'pending',
        status: 'assigned',
        assignedAt: new Date(NOW.getTime() - 15 * 60000).toISOString(),
        items: [
            { id: 1, name: 'Churrasco de Res 300gr', qty: 1, price: 36000 },
            { id: 2, name: 'Mazorca Desgranada', qty: 1, price: 30000 },
            { id: 3, name: 'Gaseosa 1.5L', qty: 1, price: 5500 },
            { id: 4, name: 'Domicilio Zona 2', qty: 1, price: 2000 }
        ],
        note: 'Timbre dañado, golpear fuerte.'
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
        cancelled: 'bg-gray-200 text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold border ${colors[type] || colors.neutral} ${className}`}>
      {children}
    </span>
    );
};

const ActionButton = ({ onClick, variant = 'primary', children, className = '', fullWidth = false, icon: Icon }) => {
    const baseStyles = "relative overflow-hidden transition-all duration-200 active:scale-[0.96] flex items-center justify-center gap-3 font-bold py-4 px-4 rounded-2xl shadow-sm select-none";
    const variants = {
        primary: `bg-[#1abc9c] hover:bg-[#16a085] text-white shadow-[0_4px_14px_0_rgba(26,188,156,0.39)]`,
        secondary: `bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700`,
        danger: `bg-white dark:bg-gray-800 text-red-500 border border-red-100 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20`,
        success: `bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30`,
        ghost: `bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700`,
    };

    return (
        <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}>
            {Icon && <Icon size={22} strokeWidth={2.5} className="shrink-0" />}
            <span className="truncate">{children}</span>
        </button>
    );
};

// --- MODAL DE AUTENTICACIÓN ---
const AuthModal = ({ isOpen, onClose, onAuthenticate, onGuestAccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', phone: '', password: '', vehicle: 'Moto' });

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (isLogin) {
            onAuthenticate({
                name: 'Andrés Driver',
                phone: formData.phone,
                vehicle: 'Moto',
                photo: null
            });
        } else {
            onAuthenticate(formData);
        }
    };

    const isValid = isLogin
        ? formData.phone && formData.password
        : formData.name && formData.phone && formData.password;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex border-b border-gray-100 dark:border-gray-800">
                    <button onClick={() => setIsLogin(true)} className={`flex-1 py-4 text-sm font-bold transition-colors ${isLogin ? 'bg-white dark:bg-gray-900 text-[#1abc9c] border-b-2 border-[#1abc9c]' : 'bg-gray-50 dark:bg-gray-800 text-gray-400'}`}>INICIAR SESIÓN</button>
                    <button onClick={() => setIsLogin(false)} className={`flex-1 py-4 text-sm font-bold transition-colors ${!isLogin ? 'bg-white dark:bg-gray-900 text-[#1abc9c] border-b-2 border-[#1abc9c]' : 'bg-gray-50 dark:bg-gray-800 text-gray-400'}`}>REGISTRARSE</button>
                </div>

                <div className="p-6">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-1">{isLogin ? '¡Hola de nuevo!' : 'Únete al equipo'}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{isLogin ? 'Tus pedidos te esperan.' : 'Regístrate y empieza a ganar.'}</p>
                    </div>

                    <div className="space-y-4">
                        {!isLogin && (
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input type="text" placeholder="Nombre Completo" className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl pl-10 p-3.5 text-gray-800 dark:text-white font-medium focus:ring-2 focus:ring-[#1abc9c]" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                        )}
                        <div className="relative">
                            <Smartphone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            <input type="tel" placeholder="Celular / Usuario" className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl pl-10 p-3.5 text-gray-800 dark:text-white font-medium focus:ring-2 focus:ring-[#1abc9c]" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            <input type="password" placeholder="Contraseña" className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl pl-10 p-3.5 text-gray-800 dark:text-white font-medium focus:ring-2 focus:ring-[#1abc9c]" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                        </div>
                        {!isLogin && (
                            <div className="relative">
                                <Bike className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <select className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl pl-10 p-3.5 text-gray-800 dark:text-white font-medium focus:ring-2 focus:ring-[#1abc9c] appearance-none" value={formData.vehicle} onChange={e => setFormData({...formData, vehicle: e.target.value})}>
                                    <option value="Moto">Moto</option>
                                    <option value="Bici">Bicicleta</option>
                                    <option value="Carro">Carro</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <button onClick={handleSubmit} disabled={!isValid} className="w-full mt-6 bg-[#1abc9c] hover:bg-[#16a085] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-black text-lg shadow-lg transform active:scale-[0.98] transition-all">
                        {isLogin ? 'INGRESAR Y ACEPTAR' : 'REGISTRAR Y ACEPTAR'}
                    </button>

                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
                        <p className="text-xs text-gray-400 mb-2 font-medium">¿Solo vas a hacer un pedido?</p>
                        <button onClick={onGuestAccess} className="w-full flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 font-bold bg-gray-100 dark:bg-gray-800 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            <Ghost size={18} /> Continuar como Invitado
                        </button>
                    </div>

                    <button onClick={onClose} className="w-full mt-2 text-xs font-bold text-gray-400 hover:text-gray-600 py-2">Cancelar Operación</button>
                </div>
            </div>
        </div>
    )
}

// --- MODAL DE PERFIL ---
const ProfileModal = ({ isOpen, onClose, user, onUpdate, onLogout }) => {
    const [editData, setEditData] = useState(user || { name: '', phone: '', vehicle: '', photo: null });
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => { if(user) setEditData(user); }, [user]);

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setEditData(prev => ({ ...prev, photo: reader.result }));
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        onUpdate(editData);
        setIsEditing(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 w-full max-w-sm sm:rounded-3xl rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-gray-800 dark:text-white">Mi Perfil</h3>
                    <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full"><X size={20}/></button>
                </div>

                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 border-4 border-white dark:border-gray-700 shadow-lg">
                            {editData.photo ? <img src={editData.photo} alt="Perfil" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><User size={48} /></div>}
                        </div>
                        <button onClick={() => fileInputRef.current.click()} className="absolute bottom-0 right-0 bg-[#1abc9c] text-white p-2 rounded-full shadow-md hover:bg-[#16a085] transition-transform active:scale-90">
                            <Camera size={16} />
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload}/>
                    </div>

                    <div className="text-center w-full">
                        {isEditing ? (
                            <input className="bg-gray-50 dark:bg-gray-800 border-none rounded-lg px-3 py-2 font-bold text-lg w-full text-center mb-2" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} placeholder="Tu nombre" />
                        ) : (
                            <h2 className="text-2xl font-black text-gray-800 dark:text-white">{user?.name || 'Invitado'}</h2>
                        )}
                        <p className="text-gray-500 font-medium">{user?.isGuest ? 'Cuenta de Invitado' : (user?.phone || 'Sin celular')}</p>
                    </div>
                </div>

                {user?.isGuest ? (
                    <div className="bg-amber-50 text-amber-700 p-4 rounded-xl mb-4 text-sm font-medium text-center">Estás en modo invitado. Regístrate para guardar tu historial.</div>
                ) : isEditing ? (
                    <div className="space-y-3 mb-6">
                        <input className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-3.5 font-medium" placeholder="Celular" value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})} />
                        <button onClick={handleSave} className="w-full bg-[#1abc9c] text-white font-bold py-3.5 rounded-xl shadow-md">Guardar Cambios</button>
                    </div>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="w-full mb-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2"><Edit3 size={18}/> Editar Datos</button>
                )}

                <button onClick={onClose} className="w-full flex items-center justify-center gap-2 text-gray-500 font-bold py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cerrar Ventana</button>
                <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 text-red-500 font-bold bg-red-50 dark:bg-red-900/10 py-4 rounded-xl hover:bg-red-100 transition-colors mt-2">
                    <LogOut size={20} /> {user?.isGuest ? 'Salir de Invitado' : 'Cerrar Sesión'}
                </button>
            </div>
        </div>
    )
}

// --- VISTA DETALLE FLOTANTE (COMPROBANTE) ---
const OrderDetail = ({ order, user, onBack, onUpdateStatus, onReject, onRevert, onRequireAuth }) => {
    if (!order) return null;

    const [showProblemMenu, setShowProblemMenu] = useState(false);

    const isDelivered = order.status === 'delivered';
    const isPendingAcceptance = order.status === 'pending_acceptance';
    const isCancelled = order.status === 'cancelled' || order.status === 'rejected';

    const statusConfig = {
        pending_acceptance: { label: 'ACEPTAR PEDIDO', subLabel: 'Confirmar ahora', next: 'assigned', icon: ThumbsUp, color: 'success' },
        assigned: { label: 'INICIAR RECOGIDA', subLabel: 'Voy al restaurante', next: 'picking_up', icon: Bike, color: 'primary' },
        picking_up: { label: 'YA LO TENGO', subLabel: 'Iniciar ruta', next: 'delivering', icon: Navigation, color: 'warning' },
        delivering: { label: 'CONFIRMAR ENTREGA', subLabel: 'Finalizar pedido', next: 'delivered', icon: CheckCircle2, color: 'success' },
        delivered: { label: 'ENTREGADO', subLabel: 'Orden finalizada', next: null, icon: CheckCircle2, color: 'secondary' },
        rejected: { label: 'RECHAZADO', subLabel: 'No tomado', next: null, icon: XCircle, color: 'danger' },
        cancelled: { label: 'CANCELADO', subLabel: 'Operación anulada', next: null, icon: XCircle, color: 'danger' }
    };

    const action = statusConfig[order.status] || statusConfig.pending_acceptance;

    const handleMainAction = () => {
        if (!user && order.status === 'pending_acceptance') {
            onRequireAuth();
        } else {
            onUpdateStatus(order.id, action.next);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#f4f6f7] dark:bg-gray-900 z-50 flex flex-col animate-in slide-in-from-right duration-300">

            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm px-4 py-3 flex items-center gap-3 z-20 sticky top-0">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
                    <ChevronLeft size={28} />
                </button>
                <div className="flex-1 text-center mr-10">
                    <h3 className="font-black text-gray-800 dark:text-white text-lg tracking-tight">
                        {isDelivered ? 'COMPROBANTE' : isCancelled ? 'CANCELADO' : `ORDEN #${order.id.split('-')[1]}`}
                    </h3>
                    <p className={`text-xs font-medium uppercase tracking-wider ${isCancelled ? 'text-red-500' : 'text-[#1abc9c]'}`}>
                        {isDelivered ? `Entregado: ${formatTime(order.deliveredAt)}` : isCancelled ? 'Anulado' : 'En Curso'}
                    </p>
                </div>
                {!isPendingAcceptance && (
                    <button onClick={() => setShowProblemMenu(!showProblemMenu)} className="absolute right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <AlertTriangle size={20} />
                    </button>
                )}
            </div>

            {/* MENU DE PROBLEMAS */}
            {showProblemMenu && (
                <div className="absolute top-[60px] left-4 right-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-1 animate-in slide-in-from-top-2 overflow-hidden">
                        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                            <h4 className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">Gestión de Problemas</h4>
                        </div>
                        <button onClick={() => { onRevert(order.id); setShowProblemMenu(false); }} className="w-full text-left p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700">
                            <div className="bg-amber-100 text-amber-600 p-2 rounded-lg"><Undo2 size={18}/></div>
                            <div>
                                <p className="font-bold text-gray-800 dark:text-white text-sm">Revertir Estado</p>
                                <p className="text-xs text-gray-500">{isCancelled ? 'Recuperar pedido' : 'Regresar al paso anterior'}</p>
                            </div>
                            <ChevronRight size={16} className="ml-auto text-gray-300"/>
                        </button>
                        {!isCancelled && (
                            <button onClick={() => { onReject(order.id, 'cancelled'); setShowProblemMenu(false); onBack(); }} className="w-full text-left p-4 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                <div className="bg-red-100 text-red-600 p-2 rounded-lg"><XCircle size={18}/></div>
                                <div>
                                    <p className="font-bold text-red-600 dark:text-red-400 text-sm">Cancelar Pedido</p>
                                    <p className="text-xs text-red-400/70">Marcar como anulado</p>
                                </div>
                            </button>
                        )}
                    </div>
                    <div className="fixed inset-0 -z-10" onClick={() => setShowProblemMenu(false)}></div>
                </div>
            )}

            {/* Contenido */}
            <div className="flex-1 overflow-y-auto p-4 pb-40 space-y-4">

                {/* --- HEADER DE EMPRESA UNIFICADO (NUEVO) --- */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#1abc9c] to-transparent"></div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-3 shadow-sm">
                            <Store size={28} />
                        </div>
                        <h2 className="text-xl font-black text-gray-800 dark:text-white leading-tight mb-1">
                            {user?.name ? `Hola ${user.name.split(' ')[0]},` : "Hola,"}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            <span className="font-black text-gray-800 dark:text-white">La Mía Pizza</span> te mandó un pedido.
                        </p>
                        <div className="inline-flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 rounded-xl text-xs font-bold text-gray-500 dark:text-gray-300 border border-gray-100 dark:border-gray-700">
                            <MapPin size={14} className="text-[#1abc9c]" />
                            Calle 12 Sur # 5-40
                        </div>
                    </div>
                </div>

                {/* Card Cliente */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden animate-in slide-in-from-bottom duration-500 delay-100">
                    {isDelivered && <div className="absolute top-0 right-0 p-4 opacity-10"><CheckCircle2 size={100} className="text-[#1abc9c]" /></div>}
                    {isCancelled && <div className="absolute top-0 right-0 p-4 opacity-10"><XCircle size={100} className="text-red-500" /></div>}
                    <div className="flex items-start gap-4 mb-6 relative z-10">
                        <div className={`${isDelivered ? 'bg-gray-100 dark:bg-gray-700 text-gray-400' : isCancelled ? 'bg-red-100 text-red-500' : 'bg-[#1abc9c]/10 text-[#1abc9c]'} p-3 rounded-2xl`}>
                            <User size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-800 dark:text-white leading-tight">{order.client}</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1 flex items-center gap-1">
                                <MapPin size={14} /> {order.address}
                            </p>
                        </div>
                    </div>
                    {!isDelivered && !isPendingAcceptance && !isCancelled && (
                        <div className="grid grid-cols-2 gap-3">
                            <ActionButton variant="secondary" icon={Phone} className="h-12 text-sm">Llamar</ActionButton>
                            <ActionButton variant="secondary" icon={MessageCircle} className="h-12 text-sm">WhatsApp</ActionButton>
                        </div>
                    )}
                </div>

                {/* Notas (Solo Lectura) */}
                {order.note && (
                    <div className="animate-in slide-in-from-bottom duration-500 delay-150">
                        <div className="relative rounded-2xl p-4 border-l-4 shadow-sm bg-amber-50 border-amber-400 dark:bg-amber-900/20 dark:border-amber-600">
                            <div className="flex justify-between items-start">
                                <h4 className="text-xs font-bold uppercase mb-1 flex items-center gap-2 text-amber-600 dark:text-amber-400">
                                    <StickyNote size={14} /> Instrucciones de la Empresa
                                </h4>
                            </div>
                            <p className="text-sm italic leading-relaxed text-gray-700 dark:text-gray-300">
                                "{order.note}"
                            </p>
                        </div>
                    </div>
                )}

                {/* Tiempos */}
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
                        <div className={`flex items-center gap-2 font-bold px-3 py-1 rounded-full ${isPendingAcceptance ? 'bg-amber-100 text-amber-600' : isCancelled ? 'bg-red-100 text-red-600' : 'bg-[#1abc9c]/10 text-[#1abc9c]'} animate-pulse`}>
                            <Clock size={16} /> {isPendingAcceptance ? 'Esperando respuesta...' : isCancelled ? 'Cancelado' : 'En curso'}
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

            {/* FOOTER ACTIONS */}
            {!isCancelled && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 z-20 pb-6">
                    {isPendingAcceptance ? (
                        <div className="grid grid-cols-2 gap-4">
                            <ActionButton variant="danger" icon={ThumbsDown} onClick={() => { onReject(order.id, 'rejected'); onBack(); }}>Rechazar</ActionButton>
                            <ActionButton variant="success" icon={ThumbsUp} onClick={handleMainAction}>Aceptar</ActionButton>
                        </div>
                    ) : (!isDelivered && action.next) ? (
                        <button
                            onClick={() => onUpdateStatus(order.id, action.next)}
                            className={`w-full py-4 rounded-2xl shadow-lg transform transition-all active:scale-[0.98] flex items-center justify-between px-6 group
                    ${action.color === 'warning' ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30' :
                                action.color === 'success' ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30' :
                                    'bg-[#1abc9c] hover:bg-[#16a085] text-white shadow-[#1abc9c]/30'}`}
                        >
                            <div className="flex flex-col items-start">
                                <span className="text-lg font-black uppercase tracking-wide">{action.label}</span>
                                <span className="text-xs opacity-90 font-medium">{action.subLabel}</span>
                            </div>
                            <div className="bg-white/20 p-2 rounded-full group-hover:translate-x-1 transition-transform">
                                <ArrowRight size={24} />
                            </div>
                        </button>
                    ) : null }
                </div>
            )}
        </div>
    );
};

// --- CARD COMPONENTE ---
const OrderCard = ({ order, onClick, showTimeDetails = false }) => {
    const isDelivered = order.status === 'delivered';
    const isCancelled = order.status === 'cancelled' || order.status === 'rejected';
    const steps = ['pending_acceptance', 'assigned', 'picking_up', 'delivering', 'delivered'];
    const progress = (steps.indexOf(order.status) / (steps.length - 1)) * 100;
    const isPending = order.status === 'pending_acceptance';

    const [elapsed, setElapsed] = useState('');

    useEffect(() => {
        if (isDelivered || isCancelled) return;
        const calculate = () => {
            const now = new Date();
            const start = new Date(order.assignedAt);
            const diffMins = Math.floor((now - start) / 60000);
            setElapsed(`${diffMins} min`);
        };
        calculate();
        const interval = setInterval(calculate, 60000);
        return () => clearInterval(interval);
    }, [order.assignedAt, isDelivered, isCancelled]);

    const getStatusColor = (status) => {
        if (status === 'pending_acceptance') return 'bg-rose-500';
        if (status === 'assigned') return 'bg-sky-500';
        if (status === 'picking_up') return 'bg-amber-500';
        if (status === 'delivering') return 'bg-[#1abc9c]';
        if (status === 'rejected' || status === 'cancelled') return 'bg-red-500';
        return 'bg-gray-400';
    };

    const getStatusLabel = (status) => {
        if (status === 'pending_acceptance') return 'Solicitud';
        if (status === 'assigned') return 'Asignado';
        if (status === 'picking_up') return 'Recogiendo';
        if (status === 'delivering') return 'En Camino';
        if (status === 'rejected') return 'Rechazado';
        if (status === 'cancelled') return 'Cancelado';
        return 'Entregado';
    };

    return (
        <div
            onClick={() => onClick(order)}
            className={`relative bg-white dark:bg-gray-800 rounded-3xl shadow-sm border transition-all duration-300 cursor-pointer overflow-hidden group animate-in fade-in zoom-in-95
      ${isDelivered
                ? 'border-gray-100 dark:border-gray-700 opacity-90 hover:opacity-100'
                : isCancelled
                    ? 'border-red-100 dark:border-red-900/30 opacity-80'
                    : isPending
                        ? 'border-rose-200 ring-2 ring-rose-500/20 hover:shadow-lg hover:shadow-rose-500/20'
                        : 'border-gray-100 dark:border-gray-700 hover:shadow-md hover:-translate-y-1'
            }`}
        >
            {!isDelivered && !isCancelled && (
                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700">
                    <div className={`h-full transition-all duration-1000 ease-out ${getStatusColor(order.status)}`} style={{ width: `${progress || 5}%` }}></div>
                </div>
            )}

            <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm transition-transform group-hover:scale-110
                        ${isDelivered ? 'bg-gray-100 text-gray-400 dark:bg-gray-700' : getStatusColor(order.status)}
                        ${isPending ? 'animate-pulse' : ''}`}>
                            {order.status === 'picking_up' ? <Bike size={18}/> :
                                order.status === 'delivering' ? <Navigation size={18}/> :
                                    isDelivered ? <CheckCircle2 size={18}/> :
                                        isCancelled ? <XCircle size={18}/> :
                                            isPending ? <Bell size={18} className="animate-swing"/> : <Package size={18}/>}
                        </div>
                        <div>
                            <h3 className={`font-black text-base leading-tight ${isDelivered || isCancelled ? 'text-gray-600 dark:text-gray-400' : 'text-gray-800 dark:text-white'}`}>
                                {order.client}
                            </h3>
                            <div className="flex items-center gap-1 mt-1">
                                {order.paymentStatus === 'paid' ? <Badge type="success">PAGADO</Badge> : <Badge type="danger">COBRAR</Badge>}
                                <span className="text-[10px] font-semibold text-gray-400">• #{order.id.split('-')[1]}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                        <span className={`text-lg font-black ${isDelivered || isCancelled ? 'text-gray-600 dark:text-gray-400' : 'text-[#1abc9c]'}`}>${order.total.toLocaleString()}</span>
                        {isDelivered || isCancelled ? (
                            <span className="text-[10px] font-bold text-gray-400 mt-1">
                             {isCancelled ? formatTime(order.assignedAt) : formatTime(order.deliveredAt)}
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
                        <p className="text-xs text-gray-600 dark:text-gray-300 font-medium truncate pr-2">{order.address}</p>
                    </div>
                    <Badge type={isDelivered ? 'neutral' : isCancelled ? 'cancelled' : isPending ? 'danger' : 'brand'} className={isDelivered ? '' : isPending ? '!bg-rose-100 !text-rose-600 !border-rose-200' : '!bg-[#1abc9c] !text-white !border-0'}>
                        {getStatusLabel(order.status)}
                    </Badge>
                </div>
                {showTimeDetails && isDelivered && (
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-2">
                        <div className="text-[10px] text-gray-500"><span className="font-bold">Inicio:</span> {formatTime(order.assignedAt)}</div>
                        <div className="text-[10px] text-gray-500 text-right"><span className="font-bold">Duración:</span> {calculateDuration(order.assignedAt, order.deliveredAt)}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- COMPONENTES DE VISTA ---
const ActiveStats = ({ orders }) => {
    const cash = orders.filter(o => !['delivered', 'cancelled', 'rejected', 'pending_acceptance'].includes(o.status) && o.paymentType === 'cash').reduce((s, o) => s + o.total, 0);
    const activeCount = orders.filter(o => ['assigned', 'picking_up', 'delivering'].includes(o.status)).length;
    const pendingCount = orders.filter(o => o.status === 'pending_acceptance').length;

    return (
        <div className="bg-[#1abc9c] rounded-3xl p-6 text-white shadow-lg shadow-[#1abc9c]/30 mb-6 relative overflow-hidden animate-in slide-in-from-top duration-500">
            <div className="absolute right-0 top-0 p-6 opacity-10 animate-pulse"><Bike size={100} /></div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-90 mb-1">Por Cobrar en Ruta</p>
            <h2 className="text-4xl font-black mb-4 tracking-tight">${cash.toLocaleString()}</h2>
            <div className="flex gap-4 text-sm font-bold">
                <span className="bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm flex items-center gap-2">
                    <Package size={14}/> {activeCount} Activos
                </span>
                {pendingCount > 0 && (
                    <span className="bg-white text-rose-600 px-3 py-1 rounded-lg shadow-md flex items-center gap-2 animate-pulse">
                        <Bell size={14}/> {pendingCount} Nuevos
                    </span>
                )}
            </div>
        </div>
    )
}

const HistoryView = ({ orders, onSelect }) => {
    const [filterMode, setFilterMode] = useState('day');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [showRejected, setShowRejected] = useState(false);

    const filteredHistory = useMemo(() => {
        return orders.filter(order => {
            if (order.status !== 'delivered' && order.status !== 'rejected' && order.status !== 'cancelled') return false;
            if (!showRejected && (order.status === 'rejected' || order.status === 'cancelled')) return false;

            const dateToCheck = order.status === 'delivered' ? order.deliveredAt : order.assignedAt;
            const orderDate = dateToCheck.split('T')[0];
            const orderMonth = dateToCheck.slice(0, 7);
            if (filterMode === 'day') return orderDate === selectedDate;
            if (filterMode === 'month') return orderMonth === selectedMonth;
            return true;
        });
    }, [orders, filterMode, selectedDate, selectedMonth, showRejected]);

    const totalHistory = filteredHistory.filter(o => o.status === 'delivered').reduce((acc, o) => acc + o.total, 0);
    const totalCash = filteredHistory.filter(o => o.status === 'delivered' && o.paymentType === 'cash').reduce((acc, o) => acc + o.total, 0);
    const totalTransfer = filteredHistory.filter(o => o.status === 'delivered' && o.paymentType === 'transfer').reduce((acc, o) => acc + o.total, 0);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm flex items-center gap-3 overflow-x-auto">
                <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl shrink-0">
                    <button onClick={() => setFilterMode('day')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${filterMode === 'day' ? 'bg-white dark:bg-gray-600 text-[#1abc9c] shadow-sm' : 'text-gray-500'}`}>Dia</button>
                    <button onClick={() => setFilterMode('month')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${filterMode === 'month' ? 'bg-white dark:bg-gray-600 text-[#1abc9c] shadow-sm' : 'text-gray-500'}`}>Mes</button>
                </div>
                {filterMode === 'day' ? (
                    <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-gray-50 dark:bg-gray-700 border-none text-sm font-bold text-gray-700 dark:text-white rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#1abc9c]"/>
                ) : (
                    <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="bg-gray-50 dark:bg-gray-700 border-none text-sm font-bold text-gray-700 dark:text-white rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#1abc9c]"/>
                )}
            </div>

            <div className="flex items-center justify-between px-2">
                <label className="flex items-center gap-2 text-sm text-gray-500 font-bold cursor-pointer">
                    <input type="checkbox" checked={showRejected} onChange={e => setShowRejected(e.target.checked)} className="rounded text-[#1abc9c] focus:ring-[#1abc9c]"/>
                    Mostrar Rechazados/Cancelados
                </label>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                <div className="absolute right-0 top-0 p-4 opacity-5 text-[#1abc9c]"><TrendingUp size={80} /></div>
                <div className="flex items-center gap-2 mb-4 relative z-10">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg text-emerald-600"><TrendingUp size={20} /></div>
                    <h3 className="font-black text-gray-800 dark:text-white text-lg">{filterMode === 'day' ? 'Cierre del Día' : 'Cierre Mensual'}</h3>
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
            <div className="space-y-3">
                {filteredHistory.length > 0 ? (
                    filteredHistory.map(order => <OrderCard key={order.id} order={order} onClick={onSelect} showTimeDetails={true} />)
                ) : (
                    <div className="text-center py-12 opacity-50"><p className="text-gray-400 font-medium">No hay registros para esta fecha.</p></div>
                )}
            </div>
        </div>
    );
};

// --- APP PRINCIPAL ---
export default function App() {
    const [darkMode, setDarkMode] = useState(false);
    const [activeTab, setActiveTab] = useState('active');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orders, setOrders] = useState(INITIAL_ORDERS);

    // User state with photo support
    const [user, setUser] = useState({ name: 'Andrés Driver', phone: '312000000', vehicle: 'Moto', photo: null });
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    useEffect(() => {
        if (darkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [darkMode]);

    const simulateNewOrder = () => {
        createRandomOrder();
        if ("vibrate" in navigator) navigator.vibrate(500);
    };

    const simulateGuestLink = () => {
        setUser(null);
        const newOrder = createRandomOrder();
        setSelectedOrder(newOrder);
    };

    const createRandomOrder = () => {
        const newOrder = {
            id: `ORD-${Math.floor(Math.random() * 1000)}`,
            client: 'Cliente Nuevo',
            phone: '300000000',
            address: 'Calle Nueva # 1-23',
            paymentType: 'cash',
            total: 25000,
            paymentStatus: 'pending',
            status: 'pending_acceptance',
            assignedAt: new Date().toISOString(),
            items: [{ id: 1, name: 'Pizza Familiar', qty: 1, price: 25000 }],
            note: 'Entregar en portería'
        };
        setOrders(prev => [newOrder, ...prev]);
        return newOrder;
    };

    const updateOrderStatus = (orderId, newStatus) => {
        const now = new Date().toISOString();
        setOrders(prevOrders => prevOrders.map(order => {
            if (order.id === orderId) {
                const updated = { ...order, status: newStatus };
                if (newStatus === 'delivered') updated.deliveredAt = now;
                if (selectedOrder && selectedOrder.id === orderId) setSelectedOrder(updated);
                return updated;
            }
            return order;
        }));
    };

    const handleAuth = (userData) => {
        setUser(userData);
        setShowAuthModal(false);
        if(selectedOrder && selectedOrder.status === 'pending_acceptance') {
            updateOrderStatus(selectedOrder.id, 'assigned');
        }
    };

    const handleGuestAccess = () => {
        setUser({ name: 'Invitado', isGuest: true });
        setShowAuthModal(false);
        if(selectedOrder && selectedOrder.status === 'pending_acceptance') {
            updateOrderStatus(selectedOrder.id, 'assigned');
        }
    };

    const revertOrderStatus = (orderId) => {
        const statusFlow = ['pending_acceptance', 'assigned', 'picking_up', 'delivering', 'delivered'];
        setOrders(prevOrders => prevOrders.map(order => {
            if(order.id === orderId) {
                // Si está rechazado o cancelado, volver al inicio (o activo)
                if (['rejected', 'cancelled'].includes(order.status)) {
                    const updated = { ...order, status: 'pending_acceptance' };
                    if(selectedOrder && selectedOrder.id === orderId) setSelectedOrder(updated);
                    return updated;
                }

                const currentIndex = statusFlow.indexOf(order.status);
                if(currentIndex > 0) {
                    const prevStatus = statusFlow[currentIndex - 1];
                    const updated = { ...order, status: prevStatus };
                    if(selectedOrder && selectedOrder.id === orderId) setSelectedOrder(updated);
                    return updated;
                }
            }
            return order;
        }));
    };

    const rejectOrder = (orderId, status = 'cancelled') => {
        const now = new Date().toISOString();
        setOrders(prevOrders => prevOrders.map(order => {
            if (order.id === orderId) {
                const updated = { ...order, status: status, deliveredAt: now };
                if (selectedOrder && selectedOrder.id === orderId) setSelectedOrder(null);
                return updated;
            }
            return order;
        }));
    };

    // Filtro mejorado
    const activeOrders = useMemo(() => {
        let filtered = orders.filter(o => !['delivered', 'cancelled', 'rejected'].includes(o.status));
        if (user?.isGuest) {
            if (selectedOrder) {
                return filtered.filter(o => o.id === selectedOrder.id);
            } else {
                return filtered.slice(0, 1);
            }
        }
        return filtered;
    }, [orders, user, selectedOrder]);

    return (
        <div className="min-h-screen bg-[#f4f6f7] dark:bg-gray-900 font-sans transition-colors duration-300 pb-24">
            <div className="bg-white dark:bg-gray-800 px-5 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-[#1abc9c] p-2 rounded-xl text-white shadow-lg shadow-[#1abc9c]/30">
                        <Bike size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="font-black text-xl tracking-tight text-gray-800 dark:text-white">+Control</h1>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{user?.isGuest ? 'Modo Invitado' : user?.name ? `Hola, ${user.name.split(' ')[0]}` : 'Domicilios'}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button onClick={() => setShowProfileModal(true)} className="rounded-full w-11 h-11 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors relative overflow-hidden border-2 border-transparent hover:border-[#1abc9c]">
                        {user?.photo ? <img src={user.photo} alt="Perfil" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><UserCircle size={24} /></div>}
                        {!user && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>}
                    </button>
                </div>
            </div>

            <div className="px-4 max-w-md mx-auto">
                <div className="bg-white dark:bg-gray-800 p-1 rounded-xl flex mb-6 shadow-sm">
                    <button onClick={() => setActiveTab('active')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'active' ? 'bg-[#f4f6f7] dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                        <Bike size={16} /> Activos ({activeOrders.length})
                    </button>
                    <button onClick={() => setActiveTab('history')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'history' ? 'bg-[#f4f6f7] dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                        <History size={16} /> Historial
                    </button>
                </div>

                {activeTab === 'active' ? (
                    <>
                        {!user?.isGuest && <ActiveStats orders={orders} />}
                        <div className="flex flex-col gap-3 mb-6">
                            <div className="flex justify-between items-center">
                                <h2 className="font-black text-lg text-gray-800 dark:text-white">En Curso</h2>
                            </div>
                            {!user?.isGuest && (
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    <button onClick={simulateNewOrder} className="whitespace-nowrap text-xs font-bold text-[#1abc9c] bg-[#1abc9c]/10 px-4 py-3 rounded-xl hover:bg-[#1abc9c]/20 transition-colors flex items-center gap-2">+ Pedido (Logueado)</button>
                                    <button onClick={simulateGuestLink} className="whitespace-nowrap text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2 border border-dashed border-gray-300 dark:border-gray-600">+ Simular Link (Visitante)</button>
                                </div>
                            )}
                        </div>
                        <div className="space-y-4 pb-10">
                            {activeOrders.length > 0 ? (
                                activeOrders.map(order => <OrderCard key={order.id} order={order} onClick={setSelectedOrder} />)
                            ) : (
                                <div className="text-center py-12">
                                    <div className="bg-gray-100 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 dark:text-gray-600"><CheckCircle2 size={40} /></div>
                                    <h3 className="text-gray-500 dark:text-gray-400 font-bold">Todo al día</h3>
                                    <p className="text-sm text-gray-400">No tienes pedidos pendientes.</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <HistoryView orders={orders} onSelect={setSelectedOrder} />
                )}
            </div>

            {selectedOrder && (
                <OrderDetail
                    order={selectedOrder}
                    user={user}
                    onBack={() => setSelectedOrder(null)}
                    onUpdateStatus={updateOrderStatus}
                    onReject={rejectOrder}
                    onRevert={revertOrderStatus}
                    onRequireAuth={() => setShowAuthModal(true)}
                />
            )}

            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onAuthenticate={handleAuth} onGuestAccess={handleGuestAccess}/>
            <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} user={user} onUpdate={setUser} onLogout={() => { setUser(null); setShowProfileModal(false); }} />
        </div>
    );
}