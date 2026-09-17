import { StudyMaterial } from "@/types/library";

const STORAGE_KEY = "nexusedu_study_library";
const LEGACY_STORAGE_KEY = "insighted_study_library";

export const INITIAL_STUDY_MATERIALS: StudyMaterial[] = [
  {
    id: "mat_cs50_001",
    title: "Harvard CS50 – Introduction to Computer Science & Algorithm Complexity",
    author: "freeCodeCamp.org / Harvard",
    category: "Computer Science",
    date: "2026-09-12",
    timestamp: Date.now() - 86400000 * 1,
    videoId: "8mAITcNt710",
    videoUrl: "https://www.youtube.com/watch?v=8mAITcNt710",
    thumbnailUrl: "https://i.ytimg.com/vi/8mAITcNt710/hqdefault.jpg",
    readTimeMinutes: 6,
    isFavorite: true,
    tags: ["Algorithms", "Big-O", "Data Structures", "Memory"],
    keyTakeaways: [
      "Binary data encoding and 64-bit word architecture.",
      "Asymptotic analysis (Big-O) ignores lower-order terms.",
      "Contiguous arrays provide O(1) random indexing, while linked lists offer dynamic allocation.",
    ],
    summary: `# Introduction to Computer Science & Algorithm Complexity

**This lecture provides a rigorous breakdown of foundational computational principles, Big-O asymptotic notation, memory hierarchies, and core data structures.**

## 1. Computational Thinking & State Representation
- Binary Data Encoding: High and low electrical voltages represent discrete boolean bits (0 and 1).
- ASCII and Unicode: Numerical mappings for text characters, emojis, and international glyphs.
- Byte Alignment: 8 bits constitute 1 byte; modern 64-bit architectures address 8 bytes per memory word.

! Integer overflow occurs when arithmetic exceeds the maximum representable bits of a primitive data type.

## 2. Algorithm Analysis and Asymptotic Notation
- Time Complexity: Quantifies number of operations executed as input size n grows asymptotically.
- Space Complexity: Measures auxiliary memory consumed during algorithm execution.
- Big-O Classes:
  - O(1): Constant time lookups (hash table keys under ideal distribution).
  - O(log n): Binary search over sorted collections.
  - O(n): Linear scans through unsorted lists.
  - O(n log n): Optimal comparison-based sorting algorithms (MergeSort, QuickSort average case).

! Asymptotic analysis ignores constant coefficients and lower-order terms to characterize scaling behavior.

## 3. Data Structures: Arrays vs. Linked Lists
- Arrays: Contiguous memory allocations enabling O(1) random indexing, but O(n) insertions and deletions.
- Linked Lists: Dynamic pointer-based nodes allowing O(1) prepend/append when tail pointers are maintained.
- Hash Tables: Key-value stores utilizing hash functions with collision resolution strategies like separate chaining.

! Memory cache locality strongly favors contiguous array structures over fragmented linked list pointers.`,
  },
  {
    id: "mat_nn_002",
    title: "Neural Networks & Backpropagation Fundamentals",
    author: "3Blue1Brown",
    category: "AI & Machine Learning",
    date: "2026-09-11",
    timestamp: Date.now() - 86400000 * 2,
    videoId: "aircAruvnKk",
    videoUrl: "https://www.youtube.com/watch?v=aircAruvnKk",
    thumbnailUrl: "https://i.ytimg.com/vi/aircAruvnKk/hqdefault.jpg",
    readTimeMinutes: 8,
    isFavorite: true,
    tags: ["Deep Learning", "Calculus", "Optimization", "Weights & Biases"],
    keyTakeaways: [
      "Neurons act as mathematical functions holding continuous values between 0 and 1.",
      "Backpropagation leverages the multivariable chain rule to calculate weight gradients.",
      "Activation functions introduce non-linearity required to fit complex decision boundaries.",
    ],
    summary: `# Neural Networks & Backpropagation Fundamentals

**A visual and mathematical exposition of artificial multi-layer perceptrons, cost surfaces, and gradient descent updates.**

## 1. Neuron Mathematical Abstraction
- Biological Analogy: Artificial neurons receive multiple weighted inputs, sum them with a bias term, and apply a non-linear activation.
- Mathematical Equation:
  - z = w₁x₁ + w₂x₂ + ... + wₙxₙ + b = W · X + b
  - a = σ(z) where σ represents an activation function (Sigmoid, ReLU, GELU).

! Linear layers stacked without activation functions collapse mathematically into a single linear transformation.

## 2. Cost Surfaces and Objective Optimization
- Loss Metric: Quantifies error between model predictions and ground-truth targets.
- Gradient Vector (∇C): Vector pointing in the direction of steepest cost ascent.
- Gradient Descent Step:
  - W_{new} = W_{old} - η · ∇C where η is the empirical learning rate.

! Local minima traps are rare in high-dimensional parameter spaces; saddle points and vanishing gradients are primary bottlenecks.

## 3. The Chain Rule in Backpropagation
- Propagation Flow: Forward pass computes intermediate activations; backward pass tracks output error gradients upstream.
- Weight Gradients: ∂C/∂w = (∂C/∂a) · (∂a/∂z) · (∂z/∂w)
- Efficiency: Dynamic programming stores upstream partial derivatives, avoiding redundant re-evaluations.`,
  },
  {
    id: "mat_linalg_003",
    title: "Essence of Linear Algebra: Vectors, Matrices & Transformations",
    author: "3Blue1Brown",
    category: "Mathematics",
    date: "2026-09-09",
    timestamp: Date.now() - 86400000 * 4,
    videoId: "fNk_zzaMoSs",
    videoUrl: "https://www.youtube.com/watch?v=fNk_zzaMoSs",
    thumbnailUrl: "https://i.ytimg.com/vi/fNk_zzaMoSs/hqdefault.jpg",
    readTimeMinutes: 5,
    isFavorite: false,
    tags: ["Linear Algebra", "Matrices", "Determinants", "Eigenvectors"],
    keyTakeaways: [
      "Matrix multiplication represents composite geometric coordinate transformations.",
      "Determinants measure the factor by which area or volume scales under transformation.",
      "Eigenvectors maintain their span direction during linear operations.",
    ],
    summary: `# Essence of Linear Algebra: Vectors, Matrices & Transformations

**Geometric intuition for matrix operations, basis vectors, determinants, and linear systems.**

## 1. Vectors as Geometric Displacements
- Basis Vectors: Standard Euclidean space is spanned by unit basis vectors î = [1, 0]ᵀ and ĵ = [0, 1]ᵀ.
- Linear Combinations: Any 2D vector v = c₁î + c₂ĵ describes a linear combination scaling the basis.
- Vector Space Span: The set of all possible vectors reachable through linear combinations of a given set.

## 2. Linear Transformations & Matrix Representation
- Defining Properties:
  - Origin remains fixed at coordinates (0, 0).
  - All grid lines remain parallel and evenly spaced.
- Matrix Columns: Columns of a matrix are precisely the coordinates where the basis vectors land after transformation.

! Matrix multiplication AB is NOT commutative in general: Order of geometric transformation matters (AB ≠ BA).

## 3. Determinant and Spatial Scaling
- Definition: Scalar representing how area (in 2D) or volume (in 3D) scales under the transformation.
- Negative Determinant: Indicates spatial orientation inversion (e.g. reflection).
- Zero Determinant: Collapses space into a lower dimension (plane to line or point), signifying non-invertibility.`,
  },
  {
    id: "mat_os_004",
    title: "Operating Systems: Concurrency, Virtual Memory & Kernel Space",
    author: "MIT OpenCourseWare",
    category: "Computer Science",
    date: "2026-09-07",
    timestamp: Date.now() - 86400000 * 6,
    videoId: "WUvTyaaNkzM",
    videoUrl: "https://www.youtube.com/watch?v=WUvTyaaNkzM",
    thumbnailUrl: "https://i.ytimg.com/vi/WUvTyaaNkzM/hqdefault.jpg",
    readTimeMinutes: 7,
    isFavorite: false,
    tags: ["Operating Systems", "Concurrency", "Virtual Memory", "Kernel"],
    keyTakeaways: [
      "Privilege rings separate untrusted user programs from direct hardware access.",
      "Page tables map virtual memory addresses to physical RAM frames with TLB caching.",
      "Mutexes and semaphores prevent race conditions in multithreaded critical sections.",
    ],
    summary: `# Operating Systems: Concurrency, Virtual Memory & Kernel Space

**Analysis of system calls, context switching, virtual page translation, and mutual exclusion primitives.**

## 1. Dual Mode Execution: User Mode vs Kernel Mode
- Hardware Protection: Ring 3 (User) restricts execution of privileged instructions (HALT, MMU configuration).
- System Call Interface: Traps transition CPU into Ring 0 (Kernel) to execute I/O, memory allocation, or network sockets.

## 2. Virtual Memory and Paging Architecture
- Virtual Address Space: Each process perceives a contiguous, isolated memory segment.
- Page Tables & MMU: Hardware translates 4KB virtual pages to physical DRAM frames.
- Translation Lookaside Buffer (TLB): High-speed hardware cache accelerating address translation.

! Page faults trigger disk I/O when referenced pages are not resident in physical memory.

## 3. Concurrency & Synchronization Primitives
- Race Conditions: Unsynchronized concurrent reads and writes corrupt shared mutable memory state.
- Mutexes & Spinlocks: Ensure mutual exclusion over critical execution blocks.
- Deadlock Conditions: Mutual exclusion, hold and wait, no preemption, and circular wait.`,
  },
  {
    id: "mat_phys_005",
    title: "Classical Mechanics: Newton's Laws, Circular Motion & Gravitation",
    author: "Prof. Walter Lewin / MIT Physics",
    category: "Physics",
    date: "2026-09-08",
    timestamp: Date.now() - 86400000 * 5,
    videoId: "wWnfJ0-xXRE",
    videoUrl: "https://www.youtube.com/watch?v=wWnfJ0-xXRE",
    thumbnailUrl: "https://i.ytimg.com/vi/wWnfJ0-xXRE/hqdefault.jpg",
    readTimeMinutes: 8,
    isFavorite: true,
    tags: ["Classical Mechanics", "Newton's Laws", "Energy", "Gravitation"],
    keyTakeaways: [
      "Newton's second law F = dp/dt connects net external force with time derivative of momentum.",
      "Centripetal acceleration a_c = v²/r always directs toward curvature center in uniform circular paths.",
      "Work-Energy theorem links the integral of net forces with change in kinetic energy.",
    ],
    summary: `# Classical Mechanics: Newton's Laws & Planetary Gravitation

**Rigorous analysis of Newtonian dynamics, inertial reference frames, mechanical work, and gravitational orbits.**

## 1. Inertial Reference Frames & Newton's Laws of Motion [00:00 - 15:30]
- Newton's First Law: An object remains at rest or moves with constant velocity unless acted upon by a non-zero external net force.
- Newton's Second Law: Vector equation F_net = m·a = dp/dt, valid across all non-accelerating inertial reference frames.
- Newton's Third Law: Action-reaction force pairs operate on distinct bodies simultaneously with equal magnitude and opposite direction.

! Fictitious forces (centrifugal, Coriolis) only manifest mathematically when formulating physics within accelerating non-inertial frames.

## 2. Circular Motion, Friction & Gravitational Potential [15:30 - 35:40]
- Centripetal Force: F_c = m·v² / r, generated by tension, gravity, normal forces, or friction.
- Static vs Kinetic Friction: f_s ≤ μ_s·N provides traction without relative surface slipping; once slipping begins, f_k = μ_k·N.
- Universal Gravitation: F_g = G·(m₁·m₂) / r², establishing inverse-square attraction across celestial bodies.

! Friction is non-conservative: The mechanical energy dissipated into thermal entropy is path-dependent.

## 3. Conservation of Mechanical Energy & Orbital Mechanics [35:40 - 50:25]
- Kinetic & Potential Energy: E_total = (1/2)·m·v² - G·M·m / r.
- Escape Velocity: Derived when total mechanical energy reaches zero: v_esc = √(2·G·M / R).
- Kepler's Second Law: Equal areas swept out in equal times arises directly from conservation of angular momentum (zero external torque).`,
  },
  {
    id: "mat_phys_006",
    title: "Quantum Mechanics: Wave-Particle Duality & Superposition",
    author: "Veritasium / Physics Foundation",
    category: "Physics",
    date: "2026-09-06",
    timestamp: Date.now() - 86400000 * 7,
    videoId: "p7bzE1E5PMY",
    videoUrl: "https://www.youtube.com/watch?v=p7bzE1E5PMY",
    thumbnailUrl: "https://i.ytimg.com/vi/p7bzE1E5PMY/hqdefault.jpg",
    readTimeMinutes: 6,
    isFavorite: false,
    tags: ["Quantum Mechanics", "Wave-Particle", "Superposition", "Uncertainty"],
    keyTakeaways: [
      "Light and matter exhibit both continuous wave interference and discrete particle quantization.",
      "Heisenberg's uncertainty principle sets fundamental limits: Δx · Δp ≥ ℏ/2.",
      "The act of measurement in quantum mechanics collapses wavefunction superpositions into discrete eigenstates.",
    ],
    summary: `# Quantum Mechanics: Wave-Particle Duality & Superposition

**Experimental evidence, mathematical formalisms, and foundational principles of quantum state spaces.**

## 1. The Double-Slit Experiment & Photon Interference [00:00 - 08:20]
- Particle vs Wave: Classical particles create two distinct stripes; waves generate alternating constructive and destructive interference fringes.
- Single Photon Firing: Even when photons pass through the apparatus one by one, an interference pattern builds up statistically over time.

! Detecting which slit the photon traveled through collapses the interference pattern back into classical classical stripes.

## 2. De Broglie Wavelength & Matter Waves [08:20 - 15:40]
- De Broglie Relation: Matter exhibits wave behavior with wavelength λ = h / p, where h is Planck's constant.
- Electron Diffraction: Confirmed experimentally that massive fermions undergo constructive diffraction across crystal lattices.

## 3. Heisenberg Uncertainty Principle & Measurement [15:40 - 21:45]
- Mathematical Inequality: Δx · Δp ≥ ℏ / 2 proves conjugate variables cannot simultaneously possess sharp values.
- Wavefunction Collapse: Born rule states probability density of finding a particle is |Ψ(x,t)|².`,
  },
  {
    id: "mat_eng_007",
    title: "Electrical Engineering: Circuit Analysis, Ohm's & Kirchhoff's Laws",
    author: "MIT OpenCourseWare",
    category: "Engineering",
    date: "2026-09-05",
    timestamp: Date.now() - 86400000 * 8,
    videoId: "fJbm14x8S-A",
    videoUrl: "https://www.youtube.com/watch?v=fJbm14x8S-A",
    thumbnailUrl: "https://i.ytimg.com/vi/fJbm14x8S-A/hqdefault.jpg",
    readTimeMinutes: 7,
    isFavorite: true,
    tags: ["Electrical", "Circuits", "Kirchhoff", "Ohm's Law"],
    keyTakeaways: [
      "Kirchhoff's Current Law (KCL) enforces conservation of electric charge at circuit nodes (ΣI = 0).",
      "Kirchhoff's Voltage Law (KVL) enforces conservation of energy around closed loops (ΣV = 0).",
      "Thévenin and Norton equivalencies simplify linear multi-source networks into single-source equivalents.",
    ],
    summary: `# Electrical Engineering: Circuit Analysis & Network Theorems

**Formulation of lumped circuit abstractions, nodal analysis, and linear system simplification techniques.**

## 1. Lumped Element Model & Fundamental Laws [00:00 - 12:40]
- Lumped Circuit Abstraction: Valid when signal wavelengths are far larger than physical circuit dimensions (λ >> d).
- Ohm's Law: V = I·R relating potential difference, electric current, and resistance.
- Joule's Law of Heating: Dissipated power P = V·I = I²·R = V²/R.

! KCL: Sum of currents entering any node equals sum of currents leaving (conservation of charge).

## 2. Nodal Voltage Analysis & Mesh Analysis [12:40 - 28:50]
- Reference Ground Node: Select one common junction as 0V reference.
- Nodal Equations: Express branch currents via (V_node - V_adjacent) / R, assembling a solvable linear matrix system G·V = I.
- Supernodes: Created when ideal voltage sources connect between two non-reference nodes without intermediate resistance.

## 3. Thévenin & Norton Equivalent Circuits [28:50 - 46:50]
- Thévenin Theorem: Any linear two-terminal circuit can be represented as an ideal open-circuit voltage source V_th in series with resistance R_th.
- Norton Theorem: Dual representation consisting of short-circuit current source I_no in parallel with R_th.
- Maximum Power Transfer: Delivers maximum load power when load resistance matches source resistance: R_load = R_th.`,
  },
  {
    id: "mat_eng_008",
    title: "Mechanical Engineering: Thermodynamics & Heat Engine Cycles",
    author: "The Efficient Engineer",
    category: "Engineering",
    date: "2026-09-04",
    timestamp: Date.now() - 86400000 * 9,
    videoId: "kYv9d5NnZvg",
    videoUrl: "https://www.youtube.com/watch?v=kYv9d5NnZvg",
    thumbnailUrl: "https://i.ytimg.com/vi/kYv9d5NnZvg/hqdefault.jpg",
    readTimeMinutes: 6,
    isFavorite: false,
    tags: ["Mechanical", "Thermodynamics", "Engine Cycles", "Efficiency"],
    keyTakeaways: [
      "The Carnot cycle establishes theoretical upper bound on heat engine efficiency: η_carnot = 1 - T_c/T_h.",
      "Otto and Diesel cycles model real internal combustion engines using idealized air-standard assumptions.",
      "Net mechanical work output corresponds to the enclosed area on a Pressure-Volume (PV) state diagram.",
    ],
    summary: `# Mechanical Engineering: Applied Thermodynamics & Power Cycles

**Thermodynamic state transformations, ideal gas properties, and power generation cycle analysis.**

## 1. First & Second Laws in Control Volumes [00:00 - 08:30]
- First Law: dU = δQ - δW. Change in internal energy equals heat supplied minus boundary work performed.
- Ideal Gas Law: P·V = m·R·T connecting pressure, volume, mass, gas constant, and absolute temperature.
- Enthalpy: H = U + P·V, convenient for analyzing open flow turbines, compressors, and heat exchangers.

## 2. The Otto & Diesel Air-Standard Cycles [08:30 - 18:20]
- Otto Cycle (Spark Ignition): Isentropic compression -> Constant-volume heat addition -> Isentropic expansion -> Constant-volume heat rejection.
- Diesel Cycle (Compression Ignition): Employs higher compression ratios with constant-pressure fuel injection.
- Net Work: W_net = ∮ P dV, matching the enclosed geometric area of the PV loop.

! Higher compression ratio increases thermodynamic efficiency, but is physically bounded by engine knock and pre-ignition limits.

## 3. Carnot Efficiency & Irreversibility [18:20 - 25:35]
- Carnot Upper Bound: η = 1 - T_cold / T_hot. No cyclic heat engine operating between two thermal reservoirs can exceed this.
- Second Law Limitations: 100% conversion of thermal energy to mechanical work in a continuous cycle is physically impossible.`,
  },
  {
    id: "mat_gen_009",
    title: "Python Tutorial for Beginners - Full Course (with Notes & Practice Questions)",
    author: "Apna College",
    category: "General",
    date: "2026-09-13",
    timestamp: Date.now() - 3600000 * 2,
    videoId: "vLqTf2b6GZw",
    videoUrl: "https://www.youtube.com/watch?v=vLqTf2b6GZw",
    thumbnailUrl: "https://i.ytimg.com/vi/vLqTf2b6GZw/hqdefault.jpg",
    readTimeMinutes: 6,
    isFavorite: true,
    tags: ["Python", "Programming", "Coding", "Beginner"],
    keyTakeaways: [
      "Python is a dynamically typed, interpreted language with expressive human-readable syntax.",
      "Lists and dictionaries are mutable, whereas strings and tuples are strictly immutable.",
      "List comprehensions provide concise syntax for transforming iterable sequences.",
    ],
    summary: `# Python Tutorial for Beginners - Full Course

**Comprehensive coverage of Python syntax, data types, control flow, functions, and object-oriented programming.**

## 1. Variables, Data Types & Basic Operations [00:00 - 10:15]
- Dynamic Typing: Python assigns types automatically at runtime without explicit declarations.
- Core Primitives: Integer (int), Floating-point (float), String (str), and Boolean (bool).
- Type Casting: Explicit conversion using int(), float(), str() constructors.

! Python uses zero-based indexing for strings, lists, and tuples.

## 2. Control Flow & Looping Constructs [10:15 - 24:30]
- Conditional Statements: if, elif, and else evaluate boolean expressions using indentation blocks.
- While Loops: Repeatedly execute code blocks as long as the loop condition evaluates to True.
- For Loops: Iterate sequentially over items of any sequence (range, list, tuple, or string).

## 3. Data Structures: Lists, Tuples, Sets & Dictionaries [24:30 - 38:00]
- Lists: Ordered, mutable collections defined with square brackets [].
- Tuples: Ordered, immutable collections defined with parentheses ().
- Dictionaries: Key-value associative hash maps with O(1) average lookup times.

## 4. Functions, Modular Design & Scope [38:00 - 45:00]
- Function Definition: Defined via the def keyword, accepting positional and keyword arguments.
- Return Values: Functions return None by default unless an explicit return expression is supplied.
- Scope Rules: LEGB hierarchy (Local, Enclosing, Global, Built-in).`,
  },
];

/**
 * Fetch all study materials from localStorage or return initial mock seed data
 */
export async function getStudyMaterials(): Promise<StudyMaterial[]> {
  try {
    if (typeof window === "undefined") {
      return INITIAL_STUDY_MATERIALS;
    }
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacy) {
        localStorage.setItem(STORAGE_KEY, legacy);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
        raw = legacy;
      }
    }
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDY_MATERIALS));
      return INITIAL_STUDY_MATERIALS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDY_MATERIALS));
      return INITIAL_STUDY_MATERIALS;
    }

    // Auto-sync check: Ensure all subjects (Physics, Engineering, Math, CS, General, AI)
    // are present so user's category tabs never show empty screens!
    const existingCategories = new Set(parsed.map((p) => p.category));
    const missingDefaults = INITIAL_STUDY_MATERIALS.filter(
      (m) => !existingCategories.has(m.category)
    );

    if (missingDefaults.length > 0) {
      const merged = [...parsed, ...missingDefaults];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }

    return parsed;
  } catch (err) {
    console.error("Error reading study library from localStorage:", err);
    return INITIAL_STUDY_MATERIALS;
  }
}

/**
 * Add or update a study material
 */
export function saveStudyMaterial(
  item: Omit<StudyMaterial, "id" | "timestamp" | "date"> & { id?: string }
): StudyMaterial {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const existing: StudyMaterial[] = raw ? JSON.parse(raw) : INITIAL_STUDY_MATERIALS;

    const id = item.id || `mat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];

    const newItem: StudyMaterial = {
      ...item,
      id,
      timestamp: Date.now(),
      date: dateStr,
      tags: item.tags || ["Lecture", "AI Notes"],
      readTimeMinutes: item.readTimeMinutes || Math.max(3, Math.ceil(item.summary.split(/\s+/).length / 200)),
    };

    // Prepend new item
    const filtered = existing.filter((m) => m.id !== id);
    const updated = [newItem, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Dispatch event so active listeners can update in real-time
    window.dispatchEvent(new Event("study_library_updated"));
    return newItem;
  } catch (err) {
    console.error("Error saving study material:", err);
    throw err;
  }
}

/**
 * Delete a study material by ID
 */
export function deleteStudyMaterial(id: string): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const existing: StudyMaterial[] = JSON.parse(raw);
    const updated = existing.filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("study_library_updated"));
  } catch (err) {
    console.error("Error deleting study material:", err);
  }
}

/**
 * Toggle favorite status
 */
export function toggleFavorite(id: string): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const existing: StudyMaterial[] = JSON.parse(raw);
    let newFavStatus = false;
    const updated = existing.map((m) => {
      if (m.id === id) {
        newFavStatus = !m.isFavorite;
        return { ...m, isFavorite: newFavStatus };
      }
      return m;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("study_library_updated"));
    return newFavStatus;
  } catch (err) {
    console.error("Error toggling favorite:", err);
    return false;
  }
}

/**
 * Reset library to default seed materials
 */
export function resetStudyLibrary(): StudyMaterial[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDY_MATERIALS));
    window.dispatchEvent(new Event("study_library_updated"));
    return INITIAL_STUDY_MATERIALS;
  } catch (err) {
    console.error("Error resetting library:", err);
    return INITIAL_STUDY_MATERIALS;
  }
}
