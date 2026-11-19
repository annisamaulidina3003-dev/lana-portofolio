/**
 * Tipe baris database (JSDoc) — cermin supabase/migrations. Hanya untuk dokumentasi
 * dan autocomplete editor; tidak ada kode runtime di sini.
 *
 * @typedef {Object} AdminUserRow
 * @property {string} user_id
 * @property {string} created_at
 *
 * @typedef {Object} ProfileRow
 * @property {string} id
 * @property {string} full_name
 * @property {string|null} headline
 * @property {string|null} statement
 * @property {string|null} bio
 * @property {string|null} photo_path
 * @property {string|null} photo_alt
 * @property {string|null} school
 * @property {string|null} class_name
 * @property {string|null} major
 * @property {string|null} location
 * @property {string|null} email
 * @property {Array<{ id: string, label?: string, url: string, handle?: string }>} social_links
 * @property {Array<Object>} education
 * @property {string[]} interests
 * @property {string|null} career_headline
 * @property {string|null} career_description
 * @property {string|null} career_dream
 * @property {string|null} career_short_term
 * @property {string|null} career_long_term
 * @property {string|null} resume_headline
 * @property {string|null} resume_summary
 * @property {string[]} featured_project_slugs
 * @property {string|null} cv_url
 * @property {boolean} is_published
 * @property {string} created_at
 * @property {string} updated_at
 *
 * @typedef {Object} ProjectRow
 * @property {string} id
 * @property {string} slug
 * @property {string} name
 * @property {string|null} category
 * @property {string|null} description
 * @property {string|null} problem
 * @property {string|null} objective
 * @property {string|null} role
 * @property {string[]} technologies
 * @property {string[]} features
 * @property {{ cover: Object|null, screenshots: Object[] }} images
 * @property {Object[]} documentation
 * @property {Object[]} feedback
 * @property {string|null} demo_url
 * @property {string|null} github_url
 * @property {number} sort_order
 * @property {boolean} is_published
 *
 * @typedef {Object} SkillRow
 * @property {string} id
 * @property {string} name
 * @property {'hard'|'soft'} category
 * @property {string} group_name
 * @property {number|null} level
 * @property {number} sort_order
 * @property {boolean} is_published
 *
 * @typedef {Object} ExperienceRow
 * @property {string} id
 * @property {'plk'|'organisasi'|'kepanitiaan'|'perlombaan'|'pekerjaan'} type
 * @property {string} title
 * @property {string|null} role
 * @property {string|null} organization
 * @property {string|null} location
 * @property {string|null} start_date   // 'YYYY-MM-DD'
 * @property {string|null} end_date
 * @property {string|null} description
 * @property {string[]} highlights
 * @property {number} sort_order
 * @property {boolean} is_published
 *
 * @typedef {Object} CertificateRow     // kind 'prestasi' = achievements
 * @property {string} id
 * @property {'sertifikat'|'prestasi'} kind
 * @property {string} title
 * @property {string|null} issuer
 * @property {string|null} rank
 * @property {string|null} issued_at
 * @property {string|null} category
 * @property {string|null} description
 * @property {string|null} credential_url
 * @property {string|null} image_path
 * @property {string|null} image_alt
 * @property {number} sort_order
 * @property {boolean} is_published
 *
 * @typedef {Object} TestimonialRow
 * @property {string} id
 * @property {'guru'|'teman'|'pengguna'|'plk'} type
 * @property {string} name
 * @property {string|null} role
 * @property {string|null} organization
 * @property {string} message
 * @property {string|null} photo_path
 * @property {number} sort_order
 * @property {boolean} is_published
 *
 * @typedef {Object} BlogRow
 * @property {string} id
 * @property {string} slug
 * @property {string} title
 * @property {string|null} category
 * @property {string|null} excerpt
 * @property {string|null} cover_path
 * @property {string|null} cover_alt
 * @property {Object[]} content
 * @property {string|null} published_at // 'YYYY-MM-DD'
 * @property {boolean} is_published
 *
 * @typedef {Object} MessageRow
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {'kesan'|'pesan'|'saran'|'pertanyaan'} category
 * @property {string} subject
 * @property {string} message
 * @property {'new'|'read'|'archived'} status
 * @property {string|null} reviewed_by
 * @property {string|null} reviewed_at
 * @property {string} created_at
 * @property {string} updated_at
 */
export {};
