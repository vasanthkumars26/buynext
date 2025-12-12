// frontend/src/components/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShoppingCart, FaHeart, FaChevronLeft } from "react-icons/fa";
import { useCart } from "../context/Cartcon";

export default function ProductDetails() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { allproducts = [], addtoCart, addToWishlist, removeFromWishlist, wishlist, cart } = useCart();

    const [product, setProduct] = useState(location.state?.product ?? null);
    const [loading, setLoading] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    // Safe gallery: images array > img > placeholder
    const getGallery = (prod) => {
        if (!prod) return ["https://via.placeholder.com/400"];
        if (Array.isArray(prod.images) && prod.images.length > 0) return prod.images;
        if (prod.img) return [prod.img];
        return ["https://via.placeholder.com/400"];
    };

    const gallery = getGallery(product);

    useEffect(() => {
        if (location.state?.product && String(location.state.product._id) === String(id)) {
            setProduct(location.state.product);
            setLoading(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (!product || String(product._id) !== String(id)) {
            if (!Array.isArray(allproducts) || allproducts.length === 0) {
                setLoading(true);
                setProduct(null);
                return;
            }
            const found = allproducts.find((p) => String(p._id) === String(id));
            if (found) {
                setProduct(found);
                setLoading(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                setProduct(null);
                setLoading(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, location.key, location.state, allproducts]);

    useEffect(() => {
        document.title = product ? `${product.desc} — Shop` : "Product — Shop";
    }, [product]);

    if (loading) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-white/6">
                    <FaChevronLeft /> Back
                </button>
                <div className="glass-dark rounded-2xl p-6">
                    <p className="text-sm text-gray-300">Loading product…</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-white/6">
                    <FaChevronLeft /> Back
                </button>
                <div className="glass-dark rounded-2xl p-6">
                    <h2 className="text-lg font-semibold">Product not found</h2>
                    <p className="text-sm text-gray-300 mt-2">We couldn't find that product. It may have been removed or the ID is incorrect.</p>
                    <Link to="/" className="mt-4 inline-block text-sm underline">Return to shop</Link>
                </div>
            </div>
        );
    }

    const isWishlisted = wishlist?.some((w) => String(w._id) === String(product._id));
    const isInCart = cart?.some((c) => String(c._id) === String(product._id));

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 mb-6 px-3 py-2 rounded-lg bg-white/6">
                <FaChevronLeft /> Back
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: gallery */}
                <div className="space-y-4">
                    <div className="bg-transparent glass-dark rounded-2xl p-4">
                        <div className="w-full aspect-[1/1] overflow-hidden rounded-xl">
                            <img
                                src={gallery[activeImage] || "https://via.placeholder.com/400"}
                                alt={product.desc || "Product Image"}
                                className="w-full h-full object-cover block max-w-full"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {gallery.map((g, idx) => (
                            <div
                                key={idx}
                                className={`w-20 h-20 rounded-xl overflow-hidden glass p-1 cursor-pointer border-2 ${idx === activeImage ? "border-cyan-400" : "border-transparent"}`}
                                onClick={() => setActiveImage(idx)}
                            >
                                <img
                                    src={g || "https://via.placeholder.com/80"}
                                    alt={`${product.desc}-${idx}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: details */}
                <div>
                    <div className="glass-dark rounded-2xl p-6 text-start">
                        <h1 className="text-2xl md:text-3xl font-bold text-white/95">{product.desc}</h1>
                        <p className="text-sm text-gray-300 mt-2">Category: <span className="font-medium text-white/90">{product.category || "N/A"}</span></p>

                        <div className="mt-4 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-2xl font-extrabold">${product.price}</p>
                                <p className="text-sm text-gray-400 mt-1">Inclusive of taxes (where applicable)</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={() => isWishlisted ? removeFromWishlist(product._id) : addToWishlist(product)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-shadow focus:outline-none ${isWishlisted ? "bg-red-500 text-white" : "bg-white/6 text-white/90 shadow-md"}`}
                            >
                                <FaHeart /> {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                            </motion.button>

                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={() => { if (!isInCart) addtoCart(product); }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium ${isInCart ? "bg-green-500 text-white cursor-default" : "bg-white/6 text-white/90 border border-white/8 hover:shadow-md"}`}
                                aria-pressed={!!isInCart}
                            >
                                <FaShoppingCart /> {isInCart ? "Added" : "Add to cart"}
                            </motion.button>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold">Product details</h3>
                            <p className="text-sm text-gray-300 mt-2">{product.longDesc || product.desc || "No extended description available."}</p>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <Link to="/" className="px-3 py-2 rounded-lg bg-white/6 inline-block">Continue shopping</Link>
                            <button
                                onClick={() => {
                                    if (!isInCart) addtoCart(product);
                                    navigate("/checkout", { state: { product } });
                                }}
                                className="px-3 py-2 rounded-lg bg-gradient-to-r from-red-400 to-red-500 text-gray-900 font-semibold"
                            >
                                Go to checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Similar items */}
            <div className="mt-6">
                <h4 className="font-semibold text-start text-2xl">Similar items</h4>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 text-start gap-3">
                    {allproducts
                        .filter((p) => String(p._id) !== String(product._id) && p.category === product.category)
                        .slice(0, 3)
                        .map((p) => (
                            <Link
                                key={p._id}
                                to={`/product/${p._id}`}
                                state={{ product: p }}
                                className="glass rounded-lg p-3 block"
                                aria-label={`View details for ${p.desc}`}
                                rel="noopener"
                            >
                                <div className="w-full aspect-[1/1] overflow-hidden rounded-md">
                                    <img src={p.img || "https://via.placeholder.com/200"} alt={p.desc ?? "Product image"} className="w-full h-full object-cover" />
                                </div>
                                <p className="text-sm font-medium mt-2 text-white/95">{p.desc}</p>
                                <p className="text-sm text-gray-300">${p.price}</p>
                            </Link>
                        ))}
                </div>
            </div>
        </div>
    );
}
