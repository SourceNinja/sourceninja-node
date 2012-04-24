(ns sourceninja-node.core
  (:require  [clojure.set :as set]
             [cljs.nodejs :as node]))

(def npm
  (node/require "npm"))

(def test-deps
  {
   "npm"
   { "version" "1.1.18"
     "dependencies"
     { "semver" { "version" "1.0.13" }
       "ini" { "version" "1.0.2" }
       "slide" { "version" "1.1.3"
                 "dependencies" { "foo" {"version" "1.1.3"
                                         "dependencies" { "bar" {"version" "1.1.3"}}}}}
       "abbrev" { "version" "1.0.3" }
       "graceful-fs" { "version" "1.1.8" }
       "minimatch" { "version" "0.2.2" }
       "nopt" { "version" "1.0.10" }
       "node-uuid" { "version" "1.3.3" }
       "proto-list" { "version" "1.0.0" }
       "rimraf" { "version" "2.0.1" }
       "request" { "version" "2.9.153" }
       "which" { "version" "1.0.5" }
       "tar" { "version" "0.1.13" }
       "fstream" { "version" "0.1.18" }
       "block-stream" { "version" "0.0.5" }
       "inherits" { "version" "1.0.0" }
       "mkdirp" { "version" "0.3.0" }
       "read" { "version" "0.0.2" }
       "lru-cache" { "version" "1.0.5" }
       "node-gyp" { "version" "0.4.1" }
       "fstream-npm" { "version" "0.0.6" }
       "uid-number" { "version" "0.0.3" }
       "archy" { "version" "0.0.2" }
       "chownr" { "version" "0.0.1" } } }

   "jcrawl"
   { "version" "0.0.1",
     "dependencies"
     { "jquery" { "version" "1.6.3"}
       "jsdom" { "version" "0.2.14"}
       "request" { "version" "2.9.202" } } }
   }
  )

(defn flatten-deps
  [input]
  (loop [output {}
         input input]

    (if-not (empty? input)

      (let [notseen (remove (partial contains? output) (keys input))
            newout (reduce #(assoc %1 %2 (get input %2)) output notseen)
            ndeps (apply merge (map #(get (get input %1) "dependencies") notseen))]

        (recur newout ndeps))
      output)))

(defn npm-ls-callback
  [_ _ lite]
  (let [deps (flatten-deps (js->clj (. js/lite -dependencies)))]
    (println deps)))

(defn load-npm-callback
  [_ npm]
  (.ls (. js/npm -commands) [] true npm-ls-callback))

(defn print-deps
  []
  (println
   (flatten-deps test-deps)))

(set! *main-cli-fn* #(.load npm load-npm-callback))
;;(set! *main-cli-fn* print-deps)
