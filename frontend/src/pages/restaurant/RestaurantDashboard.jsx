import { useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw, Search, Utensils, X } from "lucide-react";
import RestaurantNavbar from "../../components/restaurant/RestaurantNavbar";
import CategorySection from "../../components/restaurant/CategorySection";
import AddCategoryModal from "../../components/restaurant/AddCategoryModal";
import CategoryEditModal from "../../components/restaurant/CategoryEditModal";
import FoodFormModal from "../../components/restaurant/FoodFormModal";
import {
  addCategory,
  addFood,
  deleteCategory,
  deleteFood,
  getCategories,
  getRestaurantFoods,
  updateCategory,
  updateFood,
} from "../../services/restaurantApi";

export default function RestaurantDashboard({ initialRestaurant }) {
  const [restaurant, setrestaurant] = useState(initialRestaurant || null);
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [foodModal, setFoodModal] = useState(null);

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [categoriesRes, foodsRes] = await Promise.all([
        getCategories(),
        getRestaurantFoods(),
      ]);

      setCategories(categoriesRes.data.categories || []);
      setFoods(foodsRes.data.foods || []);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Your restaurant session has expired. Please sign in again.");
      } else {
        setError(err.response?.data?.message || "Unable to load dashboard.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const filteredFoods = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return foods;

    return foods.filter((food) =>
      [food.name, food.description, food.categoryName, food.CategoryName]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [foods, search]);

  const foodsForCategory = (categoryId) =>
    filteredFoods.filter((food) => String(food.categoryId) === String(categoryId));

  const handleAddCategory = async (name) => {
    setSaving(true);
    try {
      const res = await addCategory({ name });
      setCategories((old) => [...old, res.data.category]);
      setShowAddCategory(false);
    } catch (err) {
      alert(err.response?.data?.message || "Unable to add category.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCategory = async (name) => {
    if (!editingCategory) return;
    setSaving(true);

    try {
      const res = await updateCategory(editingCategory._id, { name });
      setCategories((old) => 
        old.map((category) => 
          category._id === editingCategory._id ? res.data.category : category
        )
      );
      
      setFoods((old) =>
        old.map((food) =>
          String(food.categoryId) === String(editingCategory._id)
            ? { ...food, categoryName: name, CategoryName: name }
            : food
        )
      );
      setEditingCategory(null);
    } catch (err) {
      alert(err.response?.data?.message || "Unable to update category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (category) => {
    if (!window.confirm(`Delete "${category.name}"? Empty categories only can be deleted.`)) return;

    try {
      await deleteCategory(category._id);
      setCategories((old) => old.filter((item) => item._id !== category._id));
    } catch (err) {
      alert(err.response?.data?.message || "Unable to delete category.");
    }
  };

  const handleAddFood = async (data) => {
    setSaving(true);

    try {
      const res = await addFood(data);
      setFoods((old) => [res.data.food, ...old]);
      setFoodModal(null);
    } catch (err) {
      alert(err.response?.data?.message || "Unable to add food.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateFood = async (data) => {
    if (!foodModal?.food) return;
    setSaving(true);

    try {
      const res = await updateFood(foodModal.food._id, data);
      setFoods((old) =>
        old.map((food) => (food._id === foodModal.food._id ? res.data.food : food))
      );
      setFoodModal(null);
    } catch (err) {
      alert(err.response?.data?.message || "Unable to update food.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFood = async (food) => {
    if (!window.confirm(`Delete "${food.name}"? This cannot be undone.`)) return;

    try {
      await deleteFood(food._id);
      setFoods((old) => old.filter((item) => item._id !== food._id));
    } catch (err) {
      alert(err.response?.data?.message || "Unable to delete food.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <RestaurantNavbar />
        <div className="mx-auto grid min-h-[70vh] max-w-400 place-items-center px-4">
          <div className="flex items-center gap-3 text-zinc-600">
            <RefreshCw className="animate-spin" size={20} />
            Loading your restaurant dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <RestaurantNavbar restaurant={restaurant} />

      <main className="mx-auto max-w-400 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            <span>{error}</span>
            <button onClick={loadDashboard} className="rounded-lg bg-white px-3 py-2">Retry</button>
          </div>
        )}

        <section className="overflow-hidden rounded-3xl bg-linear-to-br from-emerald-700 via-emerald-600 to-teal-600 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-100">Restaurant dashboard</p>
              <h1 className="mt-2 text-3xl font-black sm:text-4xl">{restaurant?.name}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50 sm:text-base">
                Manage your categories, dishes, pricing and descriptions. Changes are reflected in the customer menu.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex">
              <div className="rounded-2xl bg-white/15 px-5 py-4 backdrop-blur">
                <p className="text-2xl font-black">{categories.length}</p>
                <p className="text-xs font-semibold text-emerald-100">Categories</p>
              </div>
              <div className="rounded-2xl bg-white/15 px-5 py-4 backdrop-blur">
                <p className="text-2xl font-black">{foods.length}</p>
                <p className="text-xs font-semibold text-emerald-100">Food items</p>
              </div>
            </div>
          </div>
        </section>

        <section className="sticky top-18 z-30 mt-5 rounded-2xl border border-zinc-200 bg-white/95 p-3 shadow-sm backdrop-blur sm:p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-zinc-400" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your menu..."
                className="w-full rounded-xl bg-zinc-100 py-2.5 pl-10 pr-10 text-sm outline-none ring-0 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-900">
                  <X size={18} />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowAddCategory(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-emerald-600"
            >
              <Plus size={18} /> Add category
            </button>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <a
                key={category._id}
                href={`#category-${category._id}`}
                className="shrink-0 rounded-full bg-zinc-100 px-4 py-2 text-sm font-bold text-zinc-700 transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                {category.name}
              </a>
            ))}
          </div>
        </section>

        <section className="mt-8 space-y-10">
          {categories.map((category) => (
            <div id={`category-${category._id}`} key={category._id}>
              <CategorySection
                category={category}
                foods={foodsForCategory(category._id)}
                onAddFood={(selected) => setFoodModal({ mode: "add", category: selected })}
                onEditFood={(food) => setFoodModal({ mode: "edit", food })}
                onDeleteFood={handleDeleteFood}
                onEditCategory={setEditingCategory}
                onDeleteCategory={handleDeleteCategory}
              />
            </div>
          ))}

          {!categories.length && (
            <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center">
              <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Utensils size={25} />
              </div>
              <h2 className="mt-4 text-xl font-black">Your menu is empty</h2>
              <p className="mx-auto mt-1 max-w-md text-sm text-zinc-500">Create your first category, then add food items to it.</p>
              <button onClick={() => setShowAddCategory(true)} className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700">
                Create first category
              </button>
            </div>
          )}
        </section>
      </main>

      {showAddCategory && (
        <AddCategoryModal
          onClose={() => setShowAddCategory(false)}
          onSubmit={handleAddCategory}
          loading={saving}
        />
      )}

      {editingCategory && (
        <CategoryEditModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSubmit={handleUpdateCategory}
          loading={saving}
        />
      )}

      {foodModal && (
        <FoodFormModal
          categories={categories}
          initialFood={foodModal.mode === "edit" ? foodModal.food : null}
          onClose={() => setFoodModal(null)}
          onSubmit={foodModal.mode === "edit" ? handleUpdateFood : handleAddFood}
          loading={saving}
        />
      )}
    </div>
  );
}
