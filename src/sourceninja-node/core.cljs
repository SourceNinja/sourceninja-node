 (ns sourceninja-node.core
  (:require  [clojure.set :as set]
             [cljs.nodejs :as node]))

(def env
  (. js/process -env))

(def npm
  (node/require "npm"))

(def https
  (if (. env -SOURCENINJA_HTTP)
    (node/require "http")
    (node/require "https")))

(def sn-post-port
  (if-let [port (. env -SOURCENINJA_PORT)]
    (js/parseInt port)
    443))

(def sn-post-host
  (if-let [hostname (. env -SOURCENINJA_HOSTNAME)]
    hostname
    "app.sourceninja.com"))

(def sn-product-id
  (. env -SOURCENINJA_PRODUCT_ID))

(def sn-product-token
  (. env -SOURCENINJA_PRODUCT_TOKEN))

(def sn-post-url
  (str "/products/" sn-product-id "/imports?import_type=node&token=" sn-product-token))

(defn make-js-map
  "makes a javascript map from a clojure one"
  [cljmap]
  (let [out (js-obj)]
    (doall (map #(aset out (name (first %)) (second %)) cljmap))
    out))

(defn create-headers
  "create a header hash for the given content string"
  [content]
  {"Content-Type" "application/json"
   "Content-Length" (. content -length)})

(defn post-options
  [json]
  (make-js-map
   {:hostname sn-post-host
    :port sn-post-port
    :path sn-post-url
    :method "POST"
    :headers (make-js-map (create-headers json))}))

(defn json-generate
  [data]
  "not good for general purpose, can't find a good general clj->js function, only works for maps"
  (str (JSON/stringify (map make-js-map data)) "\n"))

(defn extract-name-and-version
  "Take the intermediate output and create a set of
   hashes. Each hash contains a name and a version"
  [input]
  (for [[name data] input]
    {"name" name
     "version" (get data "version")}))

(defn flatten-deps
  "Consume the graph that we get from NPM and spit out a hash of hashes.
   Each hash contains a name and a version, duplicates are eliminated"
  [input]
  (extract-name-and-version
   (loop [output {}
          input input]

     (if-not (empty? input)

       (let [notseen (remove (partial contains? output) (keys input))
             newout (reduce #(assoc %1 %2 (get input %2)) output notseen)
             ndeps (apply merge (map #(get (get input %1) "dependencies") notseen))]

         (recur newout ndeps))
       output))))

(defn conn-response-handler
  [res]
  (println (str "status: " (. res -statusCode)))
  (println (str "headers: " (js->clj (. res -headers)))))

(defn conn-error-handler
  [e]
  (if (= (. e -errno) (. js/process -ECONNREFUSED))
    (println (str "ECONNREFUSED: connection refused to "
                  post-host
                  ":"
                  post-port))

    (println "blargl " (js->clj e))))

(defn post-deps
  [deps]
  (let [json (json-generate deps)
        options (post-options json)
        request (.request https options conn-response-handler)]

    (.write request json)
    (.end request)))

(defn npm-ls-callback
  [_ _ lite]
  (let [deps (flatten-deps (js->clj (. js/lite -dependencies)))]
    (post-deps deps)))

(defn load-npm-callback
  [_ npm]
  (.ls (. js/npm -commands) [] true npm-ls-callback))

(defn kaboom
  []
  (.load npm load-npm-callback))

(set! *main-cli-fn* kaboom)
