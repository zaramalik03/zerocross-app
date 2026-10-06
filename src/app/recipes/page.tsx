"use client"
import React from 'react'
import Link from 'next/link'
// import Filter from '@/components/Filter'
// import { recipes, type Recipe } from '@/data'

// const difficultyColors: Record<string, { bg: string; text: string }> = {
//   Easy: { bg: '#D1FAE5', text: '#065F46' },
//   Medium: { bg: '#FEF3C7', text: '#92400E' },
//   Hard: { bg: '#FEE2E2', text: '#991B1B' },
// }

export default function RecipesPage() {
  // const [selectedFilters, setSelectedFilters] = React.useState<string[]>([])
  // const [search, setSearch] = React.useState('')
  // const [difficulty, setDifficulty] = React.useState<string | null>(null)

  // const filtered = React.useMemo(() => {
  //   return recipes.filter((r: Recipe) => {
  //     const searchOk = !search || r.name.toLowerCase().includes(search.toLowerCase())
  //     const diffOk = !difficulty || r.difficulty === difficulty
  //     const filterOk = selectedFilters.length === 0 || selectedFilters.every(f => r.dietaryTags.includes(f))
  //     return searchOk && diffOk && filterOk
  //   })
  // }, [selectedFilters, search, difficulty])

  return (
    <div className="page-shell">
      <div className="page-header px-6 lg:px-12 py-12">
        <div className="max-w-7xl mx-auto">
          <p className="section-label mb-2">Recipes</p>
          <h1 className="section-title mb-3">Recipes Page Coming Soon</h1>
          <p className="section-body max-w-xl">
            Recipes developed in certified allergen-free production spaces — spanning multiple flavors of cuisines.
            Check out our personalized recipe generator today!
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-0 pt-8">
          <Link
            href="/recipe-generator"
            className="primary-button"
          >
            Click here
          </Link>
        </div>
      </div>

      {/* <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10"> */}
        {/* Search + quick filters */}
        {/* <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 max-w-sm px-5 py-3 rounded-full text-sm outline-none border"
            style={{ borderColor: '#D1D5DB', backgroundColor: '#FFFFFF', color: '#1A3D2B' }}
          />
          <div className="flex gap-2">
            {['Easy', 'Medium', 'Hard'].map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(difficulty === d ? null : d)}
                className="px-4 py-2 rounded-full text-xs font-semibold border transition-all"
                style={difficulty === d
                  ? { backgroundColor: '#1A3D2B', color: '#FAF7F0', borderColor: '#1A3D2B' }
                  : { backgroundColor: 'transparent', color: '#4A5568', borderColor: '#D1D5DB' }
                }
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="w-full lg:w-64 shrink-0">
            <Filter onFilterChange={setSelectedFilters} />
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm" style={{ color: '#6B7280' }}>
                {filtered.length} recipe{filtered.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🍽️</div>
                <p className="font-semibold" style={{ color: '#1A3D2B' }}>No recipes match your filters</p>
                <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((recipe: Recipe) => {
                  const { bg: dBg, text: dText } = difficultyColors[recipe.difficulty] || { bg: '#F3F4F6', text: '#374151' }
                  return (
                    <div
                      key={recipe.id}
                      className="rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                      style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}
                    >
                      <div
                        className="flex items-center justify-center py-8 text-5xl relative"
                        style={{ backgroundColor: '#F0EBE0' }}
                      >
                        {recipe.image}
                        <span
                          className="absolute top-3 right-3 text-xs px-2.5 py-0.5 rounded-full font-semibold"
                          style={{ backgroundColor: dBg, color: dText }}
                        >
                          {recipe.difficulty}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-base mb-1" style={{ color: '#1A3D2B' }}>{recipe.name}</h3>
                        <p className="text-xs mb-4 leading-relaxed" style={{ color: '#6B7280' }}>{recipe.description}</p>

                        <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-t border-b" style={{ borderColor: '#F3F4F6' }}>
                          <div className="text-center">
                            <div className="text-xs" style={{ color: '#9CA3AF' }}>Time</div>
                            <div className="text-sm font-semibold" style={{ color: '#1A3D2B' }}>
                              {recipe.cookTime >= 60 ? `${Math.round(recipe.cookTime / 60)}h` : `${recipe.cookTime}m`}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs" style={{ color: '#9CA3AF' }}>Serves</div>
                            <div className="text-sm font-semibold" style={{ color: '#1A3D2B' }}>{recipe.servings}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs" style={{ color: '#9CA3AF' }}>Ingredients</div>
                            <div className="text-sm font-semibold" style={{ color: '#1A3D2B' }}>{recipe.ingredients.length}</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {recipe.dietaryTags.slice(0, 4).map((tag: string) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}
                            >
                              {tag}
                            </span>
                          ))}
                          {recipe.dietaryTags.length > 4 && (
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}
                            >
                              +{recipe.dietaryTags.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div> 
        </div> 
      </div> */}
    </div>
  )
}

// Old code from last week
// "use client"
// import React from 'react'
// import Filter from '@/components/Filter'
// import { recipes, type Recipe } from '@/data'

// const RecipesPage = () => {
//     const [selectedDiets] = React.useState<string[]>([])

//     const filteredRecipes = React.useMemo(() => {
//         if (selectedDiets.length === 0) return recipes
//         return recipes.filter((recipe: Recipe) =>
//             selectedDiets.every(diet => recipe.dietaryTags.includes(diet))
//         )
//     }, [selectedDiets])

//     return (
//         <div className="p-4 lg:px-20 xl:px-40">
//             <div className="flex flex-col md:flex-row gap-8">
//                 <div className="w-full md:w-1/4">
//                     <Filter />
//                 </div>

//                 <div className="w-full md:w-3/4">
//                     <h1 className="text-3xl font-bold mb-6">Recipes</h1>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                         {filteredRecipes.map((recipe: Recipe) => (
//                             <div key={recipe.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
//                                 <div className="bg-gray-100 p-6 text-5xl text-center">{recipe.image}</div>
//                                 <div className="p-4">
//                                     <h3 className="font-bold text-lg mb-2">{recipe.name}</h3>
//                                     <p className="text-sm text-gray-600 mb-3">{recipe.description}</p>
                                    
//                                     <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
//                                         <div>
//                                             <p className="text-gray-500">Cook Time</p>
//                                             <p className="font-semibold">{recipe.cookTime} min</p>
//                                         </div>
//                                         <div>
//                                             <p className="text-gray-500">Servings</p>
//                                             <p className="font-semibold">{recipe.servings}</p>
//                                         </div>
//                                         <div>
//                                             <p className="text-gray-500">Difficulty</p>
//                                             <p className="font-semibold">{recipe.difficulty}</p>
//                                         </div>
//                                     </div>

//                                     <div className="mb-3">
//                                         <p className="text-xs font-semibold text-gray-500 mb-2">Tags:</p>
//                                         <div className="flex flex-wrap gap-1">
//                                             {recipe.dietaryTags.map((tag: string) => (
//                                                 <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
//                                                     {tag}
//                                                 </span>
//                                             ))}
//                                         </div>
//                                     </div>

//                                     <div>
//                                         <p className="text-xs font-semibold text-gray-500 mb-2">Ingredients:</p>
//                                         <ul className="text-sm list-disc list-inside text-gray-700">
//                                             {recipe.ingredients.slice(0, 3).map((ing: string, idx: number) => (
//                                                 <li key={idx}>{ing}</li>
//                                             ))}
//                                             {recipe.ingredients.length > 3 && (
//                                                 <li>+{recipe.ingredients.length - 3} more</li>
//                                             )}
//                                         </ul>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default RecipesPage