(ns sourceninja.core
  (:require [cljs.nodejs :as node]))

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

(def boundary
  "blargl")

(defn sn-post-url
  [id]
  (str "/products/" id "/imports"))

(defn make-js-map
  "makes a javascript map from a clojure one"
  [cljmap]
  (let [out (js-obj)]
    (doall (map #(aset out (name (first %)) (second %)) cljmap))
    out))

(defn encode-field-part
  [boundary name value]
  (str "--" boundary "\r\n"
       "Content-Disposition: form-data; name=\"" name "\"\r\n\r\n"
       value "\r\n"))

(defn encode-file-part
  [boundary type name filename]
  (str "--" boundary "\r\n"
       "Content-Disposition: form-data; name=\"" name "\"; filename=\"" filename "\"\r\n"
       "Content-Type: " type "\r\n\r\n"))

(defn create-headers
  "create a header hash for the given content string"
  [content boundary]
  (make-js-map
   {"Content-Type" (str "multipart/form-data; boundary=" boundary)
    "Content-Length" (. content -length)}))

(defn post-options
  [url headers]
  (make-js-map
   {:hostname sn-post-host
    :port sn-post-port
    :path url
    :method "POST"
    :headers headers}))

(defn json-generate
  [data]
  "not good for general purpose, can't find a good general clj->js function, only works for maps"
  (str (JSON/stringify (apply array (map make-js-map data))) "\n"))

(defn format-deps
  "Take the intermediate output and create a set of
   hashes. Each hash contains a name and a version"
  [input direct]
  (for [[name data] input]
    {"name" name
     "version" (get data "version")
     "direct" (contains? direct name)}))

(defn flatten-deps
  "Consume the graph that we get from NPM and spit out a hash of hashes.
   Each hash contains a name and a version, duplicates are eliminated"
  [input]
  (loop [output {}
         input input]

    (if-not (empty? input)

      (let [notseen (remove (partial contains? output) (keys input))
            newout (reduce #(assoc %1 %2 (get input %2)) output notseen)
            ndeps (apply merge (map #(get (get input %1) "dependencies") notseen))]

        (recur newout ndeps))
      output)))

(defn conn-response-handler
  [res]
  (let [status (. res -statusCode)]
    (if (= status 201)
      (println "Sent data to SourceNinja")
      (do
        (println "Error sending data to SourceNinja:" status)
        ;; (println (str "headers: " (js->clj (. res -headers))))
        ;; (.on res "data" println)
        ))))

(defn conn-refused-handler
  [url ex]
  (println "Error connecting to SourceNinja")
  (println "HOST" sn-post-host)
  (println "PORT" sn-post-port)
  (println "PATH" url)
  (println "EXCEPTION" (js->clj ex)))

(defn post-deps
  [id token deps]
  (let [url (sn-post-url id)
        json (json-generate (format-deps (flatten-deps deps) (set (keys deps))))
        form_data (str (encode-field-part boundary "token" token)
                       (encode-field-part boundary "meta_source_type" "node")
                       (encode-field-part boundary "import_type" "json")
                       (encode-file-part boundary "application/json" "import[import]" "node.json")
                       json
                       "\r\n--" boundary "--")
        headers (create-headers form_data boundary)
        options (post-options url headers)
        request (.request https options conn-response-handler)]

    (.on request "error" (partial conn-refused-handler url))
    (.write request form_data)
    (.end request)))

(defn npm-ls-callback
  [id token _ _ lite]
  (let [deps (js->clj (. js/lite -dependencies))]
    (post-deps id token deps)))

(defn load-npm-callback
  [id token _ npm]
  (.ls (. js/npm -commands) (array) true (partial npm-ls-callback id token)))

(defn ^:export kapow
  ([]
     (kapow (. env -SOURCENINJA_PRODUCT_ID) (. env -SOURCENINJA_TOKEN)))

  ([id token]
     (if (= id js/undefined)
       (println "Product ID is not set, can't send data to SourceNinja")
       (if (= token js/undefined)
         (println "Product token is not set, can't send data to SourceNinja")
         (.load npm (partial load-npm-callback id token))))))

(defn noop
  []
  nil)

(set! *main-cli-fn* noop)
